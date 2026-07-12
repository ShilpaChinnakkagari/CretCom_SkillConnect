import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const dropdownRef = useRef(null);

  // ===== TRANSLATE INDIVIDUAL TEXT =====
  const translateText = async (text, targetLang, sourceLang = 'en') => {
    if (!text || text.trim() === '') return text;
    if (targetLang === sourceLang) return text;

    try {
      const response = await axios.post(
        'http://localhost:5000/translate',
        {
          q: text,
          source: sourceLang,
          target: targetLang
        },
        { withCredentials: false }
      );
      return response.data.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // ===== TRANSLATE ONE BY ONE (NO SEPARATOR ISSUES) =====
  const translateBatch = async (texts, targetLang, sourceLang = 'en') => {
    if (!texts || texts.length === 0) return texts;
    if (targetLang === sourceLang) return texts;

    const results = [];
    const batchSize = 5; // Translate 5 at a time to avoid rate limits
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (text) => {
          // Skip very short texts (like single characters)
          if (text.trim().length <= 1) return text;
          return await translateText(text, targetLang, sourceLang);
        })
      );
      results.push(...batchResults);
    }
    
    return results;
  };

  // ========== CHANGE LANGUAGE ==========
  const changeLanguage = async (langCode) => {
    setIsOpen(false);
    
    if (langCode === 'en') {
      localStorage.removeItem('preferredLanguage');
      window.location.reload();
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);

    try {
      const mainContent = document.getElementById('root');
      if (!mainContent) {
        setIsTranslating(false);
        return;
      }

      setTranslationProgress(10);

      // Get all text nodes
      const walker = document.createTreeWalker(
        mainContent,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.textContent.trim() === '') {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      
      setTranslationProgress(20);
      
      if (textNodes.length === 0) {
        setIsTranslating(false);
        return;
      }
      
      const texts = textNodes.map(n => n.textContent);
      
      setTranslationProgress(30);
      
      const translatedTexts = await translateBatch(texts, langCode);
      
      setTranslationProgress(80);
      
      // Apply translations
      textNodes.forEach((node, index) => {
        if (index < translatedTexts.length && translatedTexts[index] !== node.textContent) {
          node.textContent = translatedTexts[index];
        }
      });
      
      setTranslationProgress(100);
      setCurrentLang(langCode);
      localStorage.setItem('preferredLanguage', langCode);
      
      setTimeout(() => {
        setIsTranslating(false);
      }, 500);
      
    } catch (error) {
      console.error('Translation error:', error);
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
      setCurrentLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className={`group relative w-14 h-14 rounded-full text-white shadow-2xl shadow-purple-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl ${
          isTranslating 
            ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
        }`}
      >
        <span className="relative z-10">{isTranslating ? '⏳' : '🌐'}</span>
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white/20 ${
          currentLang !== 'en' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
        }`}></div>
      </button>

      {isTranslating && (
        <div className="absolute bottom-16 right-0 w-64 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 animate-slideUp">
          <div className="text-center">
            <p className="text-white text-sm mb-2">Translating...</p>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${translationProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs mt-1">{translationProgress}%</p>
          </div>
        </div>
      )}

      {isOpen && !isTranslating && (
        <div className="absolute bottom-16 right-0 w-56 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slideUp">
          <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
            <p className="text-xs text-gray-400 px-3 py-1 border-b border-white/5 mb-1">🌍 Select Language</p>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  currentLang === lang.code
                    ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {currentLang === lang.code && (
                  <span className="ml-auto text-xs text-green-400">✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-white/5 px-4 py-2 flex justify-between items-center">
            <p className="text-[10px] text-gray-500">In-page translation</p>
            {currentLang !== 'en' && (
              <button 
                onClick={() => changeLanguage('en')}
                className="text-[10px] text-blue-400 hover:text-blue-300"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.2s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;