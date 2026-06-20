// controllers/aiController.js
const { generateContent } = require("../service/geminiClient");

const generateGeminiResponse = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const reply = (await generateContent(prompt)) || "No reply from Gemini.";
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
