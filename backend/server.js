const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ===== GOOGLE TRANSLATE (NO API KEY NEEDED) =====
// This uses the public Google Translate API that Chrome uses
const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';

// ===== SUPPORTED LANGUAGES =====
const SUPPORTED_LANGUAGES = {
  'hi': 'hi',
  'te': 'te',
  'ta': 'ta',
  'kn': 'kn',
  'ml': 'ml',
  'mr': 'mr',
  'gu': 'gu',
  'bn': 'bn',
  'pa': 'pa',
  'or': 'or',
  'as': 'as',
};

// ===== TRANSLATE USING GOOGLE =====
async function translateWithGoogle(text, targetLang, sourceLang = 'en') {
  const url = `${GOOGLE_TRANSLATE_API}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data && data[0]) {
    let translated = '';
    for (const part of data[0]) {
      if (part[0]) translated += part[0];
    }
    return translated || text;
  }
  return text;
}

// ===== TRANSLATE TEXT =====
app.post("/translate", async (req, res) => {
  const { q, source = "en", target } = req.body;
  
  if (!q || !target) {
    return res.status(400).json({ error: "Missing text or target language" });
  }

  // Check if language is supported by Google
  const targetLang = SUPPORTED_LANGUAGES[target] || target;

  try {
    console.log(`🔄 Translating to: ${targetLang} (${q.length} chars)`);
    const translated = await translateWithGoogle(q, targetLang, source);
    res.json({ translatedText: translated });
    console.log(`✅ Translation successful`);
  } catch (e) {
    console.error('Translation failed:', e.message);
    res.status(502).json({ error: "Translation failed", details: e.message });
  }
});

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Google Translate" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Translation server running on http://localhost:${PORT}`);
  console.log(`📡 Using Google Translate API (no key needed)`);
});