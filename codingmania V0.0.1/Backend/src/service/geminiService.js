

const { generateContent } = require("./geminiClient");

exports.generateQuestions = async (technology, level, mcqCount, textCount) => {
  const prompt = `
Generate ${mcqCount} multiple choice questions and ${textCount} text-based questions for an interview quiz on "${technology}".
Level: ${level}.
Output in valid JSON array format with this structure:

[
  {
    id: 'unique-id',
    type: 'mcq' or 'text',
    question: '',
    options: ["A", "B", "C", "D"] (only for mcq),
    correctAnswer: 'Correct option' (only for mcq),
    explanation: ''
  },
  ...
]

Return ONLY the JSON.
`;

  try {
    const rawText = await generateContent(prompt);
    const cleanedText = rawText.trim().replace(/```json|```/g, "");
    const parsed = JSON.parse(cleanedText);

    return parsed;
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate questions using Gemini");
  }
};
