// controllers/aiController.js
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const generateGeminiResponse = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        "Failed to generate AI content.",
    });
  }
};

module.exports = { generateGeminiResponse };
