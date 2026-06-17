// controllers/chatController.js
const axios = require("axios");

const handleChat = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            role: "user", // ✅ REQUIRED for Gemini
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY, // ✅ Your API key in .env
        },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from Gemini.";
    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        "Failed to get response from Gemini AI",
    });
  }
};

module.exports = { handleChat };
