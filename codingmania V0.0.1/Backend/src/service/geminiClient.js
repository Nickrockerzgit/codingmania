// Shared Gemini client — single source of truth for the model + endpoint.
// To switch models in the future, change GEMINI_MODEL here (or set it in .env).
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

/**
 * Send a prompt to Gemini and return the generated text.
 * Throws the underlying axios error so callers can map status codes.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const generateContent = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  const response = await axios.post(
    GEMINI_API_URL,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
      params: { key: process.env.GEMINI_API_KEY },
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

module.exports = { generateContent, GEMINI_MODEL, GEMINI_API_URL };
