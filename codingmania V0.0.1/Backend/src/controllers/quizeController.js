// const { generateQuestions } = require('../service/geminiService');
// const { v4: uuidv4 } = require('uuid');

// exports.getQuizQuestions = async (req, res) => {
//   const { technology, level, mcqCount, textCount } = req.body;

//   if (!technology || !level || mcqCount === undefined || textCount === undefined) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const questions = await generateQuestions(technology, level, mcqCount, textCount);

//     // Add UUID to each question
//     const questionsWithId = questions.map(q => ({ ...q, id: uuidv4() }));
//     res.json({ questions: questionsWithId });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch questions', error: err.message });
//   }
// };







const { generateQuestions } = require('../service/geminiService');

// ESM package (uuid) ko CommonJS me use karne ka safe tareeka
const generateUUID = async () => {
  const { v4: uuidv4 } = await import('uuid');
  return uuidv4();
};

exports.getQuizQuestions = async (req, res) => {
  const { technology, level, mcqCount, textCount } = req.body;

  if (!technology || !level || mcqCount === undefined || textCount === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const questions = await generateQuestions(technology, level, mcqCount, textCount);

    // Har question me unique UUID add karna
    const questionsWithId = await Promise.all(
      questions.map(async (q) => ({
        ...q,
        id: await generateUUID()
      }))
    );

    res.json({ questions: questionsWithId });

  } catch (err) {
    console.error("Quiz Generation Error:", err);
    res.status(500).json({ message: 'Failed to fetch questions', error: err.message });
  }
};
