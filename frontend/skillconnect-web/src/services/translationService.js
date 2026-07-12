import axios from 'axios';

// ===== USE CORS PROXY WITH MYMEMORY API =====
// The proxy bypasses CORS restrictions, making the API work from localhost.
const CORS_PROXY = 'https://corsproxy.io/?';
const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// ===== SUPPORTED LANGUAGES =====
export const SUPPORTED_LANGUAGES = [
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

// Translate a single text
export const translateText = async (text, targetLang, sourceLang = 'en') => {
  if (!text || text.trim() === '') return text;
  if (targetLang === sourceLang) return text;

  try {
    // Construct the URL with the proxy
    const url = `${CORS_PROXY}${encodeURIComponent(
      `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    )}`;
    
    const response = await axios.get(url, {
      timeout: 15000, // 15 second timeout
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.data && response.data.responseStatus === 200) {
      return response.data.responseData.translatedText || text;
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error.message);
    return text;
  }
};

// Translate multiple texts in batch
export const translateBatch = async (texts, targetLang, sourceLang = 'en') => {
  if (!texts || texts.length === 0) return texts;
  if (targetLang === sourceLang) return texts;

  try {
    // Use a unique separator to combine texts
    const separator = '|||TRANSLATE_SEPARATOR|||';
    const combined = texts.join(separator);
    const translated = await translateText(combined, targetLang, sourceLang);
    return translated.split(separator);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
};