// import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from 'dotenv';

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const generateCoverLetter = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       address,
//       companyName,
//       jobTitle,
//       jobDescription,
//       experience,
//       skills
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !companyName || !jobTitle || !jobDescription) {
//       return res.status(400).json({
//         error: 'Missing required fields: name, email, companyName, jobTitle, and jobDescription are required'
//       });
//     }

//     // Create the prompt for Gemini AI
//     const prompt = `
//       Generate a professional cover letter based on the following information:

//       Personal Information:
//       - Name: ${name}
//       - Email: ${email}
//       - Phone: ${phone || 'Not provided'}
//       - Address: ${address || 'Not provided'}

//       Job Application Details:
//       - Company Name: ${companyName}
//       - Job Title: ${jobTitle}
//       - Job Description: ${jobDescription}

//       Candidate Background:
//       - Experience: ${experience || 'Not provided'}
//       - Skills: ${skills || 'Not provided'}

//       Please create a compelling, professional cover letter that:
//       1. Is properly formatted with appropriate spacing
//       2. Addresses the hiring manager professionally
//       3. Highlights relevant skills and experience that match the job requirements
//       4. Shows enthusiasm for the position and company
//       5. Has a strong opening and closing
//       6. Is concise but comprehensive (around 3-4 paragraphs)
//       7. Uses professional language and tone
//       8. Includes proper salutation and sign-off

//       Format the cover letter as a complete document ready to send.
//     `;

//     // Generate content using Gemini AI
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const coverLetter = response.text();

//     // Return the generated cover letter
//     res.json({
//       success: true,
//       coverLetter: coverLetter.trim()
//     });

//   } catch (error) {
//     console.error('Error generating cover letter:', error);
    
//     // Handle specific error types
//     if (error.message?.includes('API key')) {
//       return res.status(401).json({
//         error: 'Invalid API key. Please check your Gemini API configuration.'
//       });
//     }
    
//     if (error.message?.includes('quota')) {
//       return res.status(429).json({
//         error: 'API quota exceeded. Please try again later.'
//       });
//     }

//     res.status(500).json({
//       error: 'Failed to generate cover letter. Please try again.',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };















const { generateContent } = require('../service/geminiClient');

const generateCoverLetter = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      companyName,
      jobTitle,
      jobDescription,
      experience,
      skills
    } = req.body;

    // Validate required fields
    if (!name || !email || !companyName || !jobTitle || !jobDescription) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, companyName, jobTitle, and jobDescription are required'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY. Add it to your .env.'
      });
    }

    // Create the prompt
    const prompt = `
   Write a professional cover letter. 
   Follow this exact structure and directly insert the provided information.
   Do not use placeholders like [Your Name].

      Generate a professional cover letter based on the following information:

      Personal Information:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone || 'Not provided'}
      - Address: ${address || 'Not provided'}

      Job Application Details:
      - Company Name: ${companyName}
      - Job Title: ${jobTitle}
      - Job Description: ${jobDescription}

      Candidate Background:
      - Experience: ${experience || 'Not provided'}
      - Skills: ${skills || 'Not provided'}

      Please create a compelling, professional cover letter that:
      1. Is properly formatted with appropriate spacing
      2. Addresses the hiring manager professionally
      3. Highlights relevant skills and experience that match the job requirements
      4. Shows enthusiasm for the position and company
      5. Has a strong opening and closing
      6. Is concise but comprehensive (around 3-4 paragraphs)
      7. Uses professional language and tone
      8. Includes proper salutation and sign-off

      Format the cover letter as a complete document ready to send.
    `;

    // Generate content using the shared Gemini client
    const coverLetter = await generateContent(prompt);

    res.json({
      success: true,
      coverLetter: coverLetter.trim()
    });

  } catch (error) {
    const status = error.response?.status;
    const apiMessage = error.response?.data?.error?.message || error.message;
    console.error('Error generating cover letter:', apiMessage);

    if (status === 400 || status === 401 || status === 403) {
      return res.status(status).json({
        error: 'Invalid GEMINI_API_KEY or request. Please check your Gemini API configuration.'
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: 'API rate limit reached. Please try again in a few seconds.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate cover letter. Please try again.',
      details: process.env.NODE_ENV === 'development' ? apiMessage : undefined
    });
  }
};

module.exports = { generateCoverLetter };
