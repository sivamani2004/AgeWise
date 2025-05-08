// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { google } from 'googleapis';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app     = express();
const PORT    = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

console.log('GNews Api loaded:', !!GNEWS_API_KEY)
console.log('Gemini API loaded:', !!API_KEY);
console.log('ElevenLabs API loaded:', !!ELEVENLABS_API_KEY);
console.log('YouTube API loaded:', !!YOUTUBE_API_KEY);

// Middleware
app.use(cors({
  origin: [
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/, // Allows any port for 127.0.0.1
    /^https?:\/\/localhost(:\d+)?$/,     // Allows any port for localhost
  ],
  methods: ['POST', 'GET'],
}));
app.use(express.json());




//  Gemini system prompt, /chat route
const SYSTEM_PROMPT =
  "Your AgeWise Assistant, a helpful, friendly AI that helps elderly users " +
  "navigate the internet and answer any general question clearly and simply. " +
  "Be supportive, human-like, and always helpful.";

// 🔁 /chat → Gemini response
app.post('/chat', async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log('📝 Prompt received:', userPrompt);

  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'user', parts: [{ text: userPrompt }] }
  ];

  try {
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-8b-001:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await apiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('No reply from Gemini');

    console.log('💬 Gemini reply:', reply);
    return res.json({ reply });

  } catch (err) {
    console.error('❌ Gemini error:', err.message);
    return res.json({ reply: "Sorry, I didn't understand that." });
  }
});





// 🔉 /speak → ElevenLabs Text-to-Speech
app.post("/speak", async (req, res) => {
  const { text } = req.body;
  console.log("🔊 ElevenLabs request:", text);

  try {
    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.2,
          speaker_boost: true
        }
      })
    });

    // 🔍 Log response status
    console.log("📡 ElevenLabs status:", ttsRes.status);

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error("❌ ElevenLabs error:", errorText);
      return res.status(500).json({ error: "ElevenLabs API error", detail: errorText });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("❌ ElevenLabs exception:", err.message);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});





// 🔍 /news → GNews API
app.get('/news', async (req, res) => {
  const page = req.query.page || 1;
  const max = req.query.max || 4;

  try {
    const url = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=12&token=${GNEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles) throw new Error('No articles received from GNews');
    res.json(data);
  } catch (err) {
    console.error("🛑 News fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});






// search-youtube → YouTube Data API, /search-youtube
console.log('Defining /search-youtube POST route'); // Added log before route definition
app.post('/search-youtube', async (req, res) => {
  console.log('✅ Request reached /search-youtube POST handler'); // Added log inside handler
  const { query } = req.body;
  console.log('🎬 Backend received YouTube query:', query);
  console.log('Using YouTube API Key:', process.env.YOUTUBE_API_KEY ? 'Present' : 'Not Present');

  if (!YOUTUBE_API_KEY) {
    console.error('❌ YouTube API Key not configured.');
    return res.status(500).json({ error: 'YouTube API Key not configured.' });
  }

  try {
    const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });
    const searchResponse = await youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults: 6,
      type: 'video',
      safeSearch: 'moderate',
    });

    const videos = searchResponse.data.items;
    res.json({ videos });

  } catch (error) {
    console.error('❌ Error searching YouTube:', error);
    // Log specific YouTube API error details if available
    if (error.errors) {
        console.error('❌ YouTube API Error Details:', error.errors);
    }
    res.status(500).json({ error: 'Failed to search YouTube.', details: error.message });
  }
});



// from server to client
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
});
