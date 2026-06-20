// import React, { useState } from 'react';
// import { Bot, Sparkles, Send, Loader2, X } from 'lucide-react';

// interface AIAssistantProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onContentGenerated: (content: any) => void;
//   currentSection: string;
// }

// export const AIAssistant: React.FC<AIAssistantProps> = ({
//   isOpen,
//   onClose,
//   onContentGenerated,
//   currentSection
// }) => {
//   const [prompt, setPrompt] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedContent, setGeneratedContent] = useState<any>(null);

//   const sectionPrompts = {
//     personalInfo: {
//       title: 'Personal Information & Summary',
//       placeholder: 'Tell me about yourself: your name, contact details, and what kind of developer/tech role you\'re looking for. For example: "I\'m John Doe, a full-stack developer from Mumbai interested in React and Node.js development..."',
//       example: 'I\'m a computer science student from Delhi, passionate about web development, looking for internships in React and Python development'
//     },
//     skills: {
//       title: 'Skills & Technologies',
//       placeholder: 'What technologies, programming languages, tools, and soft skills do you have? For example: "I know JavaScript, React, Python, Git, and I\'m good at problem-solving and teamwork..."',
//       example: 'I know JavaScript, React, Node.js, Python, MongoDB, Git, VS Code, and I have good communication and problem-solving skills'
//     },
//     education: {
//       title: 'Education Background',
//       placeholder: 'Tell me about your educational background: degree, college/university, year, percentage/CGPA. For example: "I\'m pursuing B.Tech in Computer Science from XYZ University, graduating in 2024 with 8.5 CGPA..."',
//       example: 'B.Tech Computer Science from Delhi University, graduating 2024, 8.2 CGPA, completed 12th from ABC School with 85%'
//     },
//     experience: {
//       title: 'Work Experience',
//       placeholder: 'Describe your work experience, internships, or relevant projects where you worked in a team. For example: "I did a 3-month internship at ABC Company as a web developer where I worked on React projects..."',
//       example: 'Internship at TechCorp as Frontend Developer for 2 months, worked on React dashboard, improved performance by 30%'
//     },
//     projects: {
//       title: 'Projects Portfolio',
//       placeholder: 'Describe your projects: what you built, technologies used, key features. For example: "I built an e-commerce website using React and Node.js with payment integration and user authentication..."',
//       example: 'Built a task management app using React and Firebase, includes user auth, real-time updates, and responsive design'
//     },
//     additional: {
//       title: 'Certifications & Achievements',
//       placeholder: 'Tell me about your certifications, achievements, awards, or notable accomplishments. For example: "I have AWS certification, won first prize in college hackathon, completed Google Developer Challenge..."',
//       example: 'AWS Cloud Practitioner certified, won college coding competition, completed 100 Days of Code challenge'
//     }
//   };

//   const generateContent = async () => {
//     if (!prompt.trim()) return;

//     setIsGenerating(true);
    
//     // Simulate AI processing delay
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     try {
//       const content = await generateAIContent(prompt, currentSection);
//       setGeneratedContent(content);
//     } catch (error) {
//       console.error('Error generating content:', error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const generateAIContent = async (userPrompt: string, section: string) => {
//     // This is a mock AI function - in a real app, you'd call an actual AI API
//     const mockResponses = {
//       personalInfo: {
//         fullName: extractName(userPrompt) || 'John Doe',
//         email: 'john.doe@email.com',
//         phone: '+91 9876543210',
//         location: extractLocation(userPrompt) || 'Mumbai, India',
//         professionalSummary: generateSummary(userPrompt)
//       },
//       skills: generateSkills(userPrompt),
//       education: generateEducation(userPrompt),
//       experience: generateExperience(userPrompt),
//       projects: generateProjects(userPrompt),
//       additional: generateAdditional(userPrompt)
//     };

//     return mockResponses[section as keyof typeof mockResponses];
//   };

//   const extractName = (text: string): string => {
//     const nameMatch = text.match(/I'?m\s+([A-Za-z\s]+?)(?:,|\s+(?:a|an|from|studying))/i);
//     return nameMatch ? nameMatch[1].trim() : '';
//   };

//   const extractLocation = (text: string): string => {
//     const locationMatch = text.match(/from\s+([A-Za-z\s]+?)(?:,|\s+(?:and|studying|pursuing|interested))/i);
//     return locationMatch ? locationMatch[1].trim() + ', India' : '';
//   };

//   const generateSummary = (text: string): string => {
//     const interests = text.toLowerCase();
//     let summary = 'Passionate and dedicated ';
    
//     if (interests.includes('student')) summary += 'computer science student ';
//     else if (interests.includes('developer')) summary += 'software developer ';
//     else summary += 'technology enthusiast ';

//     if (interests.includes('react')) summary += 'with expertise in React and modern web development. ';
//     else if (interests.includes('python')) summary += 'with strong skills in Python and backend development. ';
//     else if (interests.includes('web')) summary += 'focused on web development and user experience. ';
//     else summary += 'with a strong foundation in programming and problem-solving. ';

//     summary += 'Seeking opportunities to contribute to innovative projects and grow in the technology industry.';
    
//     return summary;
//   };

//   const generateSkills = (text: string): any[] => {
//     const skillsText = text.toLowerCase();
//     const skills = [];

//     // Technical skills
//     const techSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS', 'MongoDB', 'SQL'];
//     techSkills.forEach(skill => {
//       if (skillsText.includes(skill.toLowerCase())) {
//         skills.push({ name: skill, category: 'technical' });
//       }
//     });

//     // Tools
//     const tools = ['Git', 'VS Code', 'GitHub', 'Postman', 'Docker'];
//     tools.forEach(tool => {
//       if (skillsText.includes(tool.toLowerCase())) {
//         skills.push({ name: tool, category: 'tools' });
//       }
//     });

//     // Soft skills
//     if (skillsText.includes('communication')) skills.push({ name: 'Communication', category: 'soft' });
//     if (skillsText.includes('problem') || skillsText.includes('solving')) skills.push({ name: 'Problem Solving', category: 'soft' });
//     if (skillsText.includes('team')) skills.push({ name: 'Teamwork', category: 'soft' });
//     if (skillsText.includes('leadership')) skills.push({ name: 'Leadership', category: 'soft' });

//     // Add default skills if none found
//     if (skills.length === 0) {
//       skills.push(
//         { name: 'JavaScript', category: 'technical' },
//         { name: 'React', category: 'technical' },
//         { name: 'Git', category: 'tools' },
//         { name: 'Problem Solving', category: 'soft' }
//       );
//     }

//     return skills;
//   };

//   const generateEducation = (text: string): any[] => {
//     const education = [];
//     const eduText = text.toLowerCase();

//     if (eduText.includes('b.tech') || eduText.includes('btech')) {
//       education.push({
//         id: Date.now().toString(),
//         degree: 'B.Tech in Computer Science',
//         institution: extractInstitution(text) || 'XYZ University',
//         year: extractYear(text) || '2024',
//         percentage: extractGrade(text) || '8.5 CGPA'
//       });
//     } else if (eduText.includes('bca')) {
//       education.push({
//         id: Date.now().toString(),
//         degree: 'BCA (Bachelor of Computer Applications)',
//         institution: extractInstitution(text) || 'ABC College',
//         year: extractYear(text) || '2024',
//         percentage: extractGrade(text) || '85%'
//       });
//     } else {
//       education.push({
//         id: Date.now().toString(),
//         degree: 'B.Tech in Computer Science',
//         institution: 'University Name',
//         year: '2024',
//         percentage: '8.0 CGPA'
//       });
//     }

//     return education;
//   };

//   const extractInstitution = (text: string): string => {
//     const match = text.match(/from\s+([A-Za-z\s]+?)\s*(?:university|college|institute)/i);
//     return match ? match[1].trim() + ' University' : '';
//   };

//   const extractYear = (text: string): string => {
//     const match = text.match(/(?:graduating|year|batch)\s*(?:in\s*)?(\d{4})/i);
//     return match ? match[1] : '';
//   };

//   const extractGrade = (text: string): string => {
//     const cgpaMatch = text.match(/(\d+\.?\d*)\s*cgpa/i);
//     if (cgpaMatch) return cgpaMatch[1] + ' CGPA';
    
//     const percentMatch = text.match(/(\d+)%/);
//     if (percentMatch) return percentMatch[1] + '%';
    
//     return '';
//   };

//   const generateExperience = (text: string): any[] => {
//     const experience = [];
//     const expText = text.toLowerCase();

//     if (expText.includes('internship') || expText.includes('intern')) {
//       experience.push({
//         id: Date.now().toString(),
//         title: extractJobTitle(text) || 'Software Development Intern',
//         company: extractCompany(text) || 'Tech Company',
//         duration: extractDuration(text) || '2 months',
//         description: generateExpDescription(text)
//       });
//     }

//     return experience;
//   };

//   const extractJobTitle = (text: string): string => {
//     const match = text.match(/as\s+([A-Za-z\s]+?)(?:\s+at|\s+for|\s+in)/i);
//     return match ? match[1].trim() : '';
//   };

//   const extractCompany = (text: string): string => {
//     const match = text.match(/at\s+([A-Za-z\s]+?)(?:\s+as|\s+for|\s+where)/i);
//     return match ? match[1].trim() : '';
//   };

//   const extractDuration = (text: string): string => {
//     const match = text.match(/(\d+)\s*(?:month|week)/i);
//     return match ? match[0] : '';
//   };

//   const generateExpDescription = (text: string): string => {
//     let description = 'Worked as part of the development team, contributing to various projects and gaining hands-on experience. ';
    
//     if (text.includes('React')) description += 'Developed user interfaces using React and modern JavaScript. ';
//     if (text.includes('performance')) description += 'Optimized application performance and improved user experience. ';
//     if (text.includes('API')) description += 'Integrated APIs and worked with backend services. ';
    
//     description += 'Collaborated with senior developers and learned industry best practices.';
    
//     return description;
//   };

//   const generateProjects = (text: string): any[] => {
//     const projects = [];
//     const projectText = text.toLowerCase();

//     if (projectText.includes('e-commerce') || projectText.includes('shopping')) {
//       projects.push({
//         id: Date.now().toString(),
//         name: 'E-commerce Website',
//         description: 'Built a full-stack e-commerce platform with user authentication, product catalog, shopping cart, and payment integration.',
//         technologies: 'React, Node.js, MongoDB, Stripe API',
//         link: 'https://github.com/username/ecommerce-project'
//       });
//     } else if (projectText.includes('task') || projectText.includes('todo')) {
//       projects.push({
//         id: Date.now().toString(),
//         name: 'Task Management App',
//         description: 'Developed a responsive task management application with real-time updates, user authentication, and collaborative features.',
//         technologies: 'React, Firebase, Material-UI',
//         link: 'https://github.com/username/task-manager'
//       });
//     } else {
//       projects.push({
//         id: Date.now().toString(),
//         name: 'Web Application Project',
//         description: 'Created a modern web application with responsive design, user-friendly interface, and robust backend functionality.',
//         technologies: 'React, Node.js, Express, MongoDB',
//         link: 'https://github.com/username/web-project'
//       });
//     }

//     return projects;
//   };

//   const generateAdditional = (text: string): any => {
//     const certifications = [];
//     const achievements = [];
//     const addText = text.toLowerCase();

//     if (addText.includes('aws')) {
//       certifications.push({
//         id: Date.now().toString(),
//         name: 'AWS Cloud Practitioner',
//         issuer: 'Amazon Web Services',
//         year: '2024'
//       });
//     }

//     if (addText.includes('google')) {
//       certifications.push({
//         id: Date.now().toString(),
//         name: 'Google Developer Challenge',
//         issuer: 'Google',
//         year: '2024'
//       });
//     }

//     if (addText.includes('hackathon') || addText.includes('competition')) {
//       achievements.push({
//         id: Date.now().toString(),
//         title: 'Coding Competition Winner',
//         description: 'Won first prize in college-level coding competition with innovative solution.'
//       });
//     }

//     if (addText.includes('100 days')) {
//       achievements.push({
//         id: Date.now().toString(),
//         title: '100 Days of Code Challenge',
//         description: 'Successfully completed the 100 Days of Code challenge, building projects daily.'
//       });
//     }

//     return { certifications, achievements };
//   };

//   const handleUseContent = () => {
//     if (generatedContent) {
//       onContentGenerated(generatedContent);
//       onClose();
//       setGeneratedContent(null);
//       setPrompt('');
//     }
//   };

//   if (!isOpen) return null;

//   const currentSectionInfo = sectionPrompts[currentSection as keyof typeof sectionPrompts];


// return (
//   <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//     <div className="bg-[#111] text-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <Bot className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">AI Assistant</h2>
//               <p className="text-sm text-gray-400">{currentSectionInfo?.title}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         {/* Content */}
//         {!generatedContent ? (
//           <div className="space-y-4">
//             {/* Info Box */}
//             <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-medium text-blue-300 mb-1">How it works</h3>
//                   <p className="text-sm text-blue-200">
//                     Describe your background and the AI will generate professional content for your resume.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Textarea Input */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Tell me about yourself
//               </label>
//               <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 rows={4}
//                 className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
//                 placeholder={currentSectionInfo?.placeholder}
//               />
//             </div>

//             {/* Example Box */}
//             <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
//               <p className="text-xs text-gray-400 mb-1">Example:</p>
//               <p className="text-sm text-gray-300 italic">"{currentSectionInfo?.example}"</p>
//             </div>

//             {/* Generate Button */}
//             <button
//               onClick={generateContent}
//               disabled={!prompt.trim() || isGenerating}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg hover:from-blue-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Generating Content...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-4 h-4" />
//                   Generate Content
//                 </>
//               )}
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {/* Success Box */}
//             <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="w-5 h-5 text-green-400" />
//                 <h3 className="font-medium text-green-300">Content Generated!</h3>
//               </div>
//               <p className="text-sm text-green-200">
//                 Review the generated content below and click "Use This Content" to add it to your resume.
//               </p>
//             </div>

//             {/* Generated Content Preview */}
//             <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
//               <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">
//                 {JSON.stringify(generatedContent, null, 2)}
//               </pre>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleUseContent}
//                 className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Use This Content
//               </button>
//               <button
//                 onClick={() => {
//                   setGeneratedContent(null);
//                   setPrompt('');
//                 }}
//                 className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
//               >
//                 Generate Again
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//     </div>
//   );

// };
















import React, { useState } from 'react';
import { Bot, Sparkles, Send, Loader2, X } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onContentGenerated: (content: any) => void;
  currentSection: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  onContentGenerated,
  currentSection,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const sectionPrompts: Record<string, { title: string; example: string; placeholder: string }> = {
    personalInfo: {
      title: 'Personal Information & Summary',
      placeholder: 'e.g., I am Rahul, a CS student from Delhi looking for frontend internships in React...',
      example: 'I am Rahul, a CS student from Delhi looking for frontend internships in React...',
    },
    skills: {
      title: 'Skills & Experties',
      placeholder: 'e.g., I know JavaScript, React, Python, and I am good at communication...',
      example: 'JavaScript, React, Node.js, MongoDB, good at communication and teamwork.',
    },
    education: {
      title: 'Education Background',
      placeholder: 'e.g., B.Tech CSE from XYZ University, 8.2 CGPA, graduating 2024...',
      example: 'B.Tech CSE from XYZ University, 8.2 CGPA, graduating 2024',
    },
    experience: {
      title: 'Work Experience',
      placeholder: 'e.g., Internship at ABC Company for 2 months in React...',
      example: 'Internship at ABC Company for 2 months in React...',
    },
    projects: {
      title: 'Projects',
      placeholder: 'e.g., Built an e-commerce site in React and Node.js...',
      example: 'E-commerce site with auth, Stripe integration, and user dashboard.',
    },
    additional: {
      title: 'Certifications & Achievements',
      placeholder: 'e.g., AWS certified, hackathon winner, 100 days of code...',
      example: 'AWS Certified, won college hackathon, completed 100 days of code.',
    },
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    const formattedPrompt = `Generate resume content for "${sectionPrompts[currentSection]?.title}". User input: ${prompt}`;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: formattedPrompt }),
      });

      const data = await res.json();

      let content = data.reply;
      try {
        content = JSON.parse(data.reply); // If reply is JSON
      } catch {
        // leave as string
      }

      setGeneratedContent(content);
    } catch (err) {
      console.error('Error:', err);
      setGeneratedContent('⚠️ Failed to generate content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent);
      setPrompt('');
      setGeneratedContent(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentInfo = sectionPrompts[currentSection];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] text-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Assistant</h2>
                <p className="text-sm text-gray-400">{currentInfo?.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {!generatedContent ? (
            <>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-300 mb-1">How it works</h3>
                    <p className="text-sm text-red-200">
                      Write something about yourself and get AI generated resume content for this section.
                    </p>
                  </div>
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
                placeholder={currentInfo?.placeholder}
              />

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 my-4">
                <p className="text-xs text-gray-400 mb-1">Example:</p>
                <p className="text-sm text-gray-300 italic">"{currentInfo?.example}"</p>
              </div>

              <button
                onClick={generateContent}
                disabled={isGenerating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 disabled:opacity-50"
              >
                {isGenerating ? <><Loader2 className="animate-spin w-4 h-4" /> Generating...</> : <><Send className="w-4 h-4" /> Generate Content</>}
              </button>
            </>
          ) : (
            <>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <h3 className="font-medium text-green-300">Generated Content</h3>
                </div>
                <p className="text-sm text-green-200 mt-2">Click "Use This Content" to apply it to your resume.</p>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto mb-4">
                <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">
                  {typeof generatedContent === 'string' ? generatedContent : JSON.stringify(generatedContent, null, 2)}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUseContent}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Use This Content
                </button>
                <button
                  onClick={() => {
                    setGeneratedContent(null);
                    setPrompt('');
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Generate Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};






















// // components/AIAssistant.tsx
// import React, { useState } from 'react';
// import { Bot, Sparkles, Send, Loader2, X } from 'lucide-react';

// interface AIAssistantProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onContentGenerated: (content: any) => void;
//   currentSection: string;
// }

// export const AIAssistant: React.FC<AIAssistantProps> = ({
//   isOpen,
//   onClose,
//   onContentGenerated,
//   currentSection,
// }) => {
//   const [prompt, setPrompt] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedContent, setGeneratedContent] = useState<any>(null);

//   const sectionPrompts: Record<string, { title: string; example: string; placeholder: string }> = {
//     personalInfo: {
//       title: 'Personal Information',
//       placeholder: 'e.g., I am Rahul from Delhi with a B.Tech in CSE...',
//       example: 'I am Rahul from Delhi with a B.Tech in CSE...',
//     },
//     skills: {
//       title: 'Skills & Expertise',
//       placeholder: 'e.g., JavaScript, React, Python...',
//       example: 'JavaScript, React, Node.js, MongoDB',
//     },
//     education: {
//       title: 'Education Background',
//       placeholder: 'e.g., B.Tech CSE from XYZ University...',
//       example: 'B.Tech CSE from XYZ University, CGPA 8.2',
//     },
//     experience: {
//       title: 'Work Experience',
//       placeholder: 'e.g., 2-month React internship...',
//       example: 'Intern at ABC Corp for 2 months',
//     },
//     projects: {
//       title: 'Projects',
//       placeholder: 'e.g., Built a portfolio site...',
//       example: 'Portfolio site with React + Tailwind',
//     },
//     additional: {
//       title: 'Certifications & Achievements',
//       placeholder: 'e.g., AWS certified, hackathon winner...',
//       example: 'AWS Certified, hackathon winner',
//     },
//   };

//   const generateContent = async () => {
//     if (!prompt.trim()) return;
//     setIsGenerating(true);

//     const formattedPrompt = `Please generate structured JSON for "${sectionPrompts[currentSection]?.title}" using the following input: ${prompt}. 
// Return a JSON object like: 
// {
//   "fullName": "",
//   "email": "",
//   "phone": "",
//   "location": "",
//   "professionalSummary": ""
// }`;

//     try {
//       const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/generate-gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: formattedPrompt }),
//       });

//       const data = await res.json();

//       let content = data.reply;
//       try {
//         content = JSON.parse(data.reply); // If reply is JSON
//       } catch {
//         console.warn('Response not in JSON format:', data.reply);
//       }

//       setGeneratedContent(content);
//     } catch (err) {
//       console.error('Error:', err);
//       setGeneratedContent('⚠️ Failed to generate content.');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleUseContent = () => {
//     if (generatedContent) {
//       onContentGenerated(generatedContent);
//       setPrompt('');
//       setGeneratedContent(null);
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   const currentInfo = sectionPrompts[currentSection];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//       <div className="bg-[#111] text-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <Bot className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">AI Assistant</h2>
//                 <p className="text-sm text-gray-400">{currentInfo?.title}</p>
//               </div>
//             </div>
//             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
//               <X className="w-5 h-5 text-gray-400" />
//             </button>
//           </div>

//           {!generatedContent ? (
//             <>
//               <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 rows={4}
//                 className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg"
//                 placeholder={currentInfo?.placeholder}
//               />

//               <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 my-4">
//                 <p className="text-xs text-gray-400 mb-1">Example:</p>
//                 <p className="text-sm text-gray-300 italic">"{currentInfo?.example}"</p>
//               </div>

//               <button
//                 onClick={generateContent}
//                 disabled={isGenerating || !prompt.trim()}
//                 className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg"
//               >
//                 {isGenerating ? <><Loader2 className="animate-spin w-4 h-4" /> Generating...</> : <><Send className="w-4 h-4" /> Generate Content</>}
//               </button>
//             </>
//           ) : (
//             <>
//               <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
//                 <h3 className="font-medium text-green-300">Generated Content</h3>
//               </div>

//               <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto mb-4">
//                 <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">
//                   {typeof generatedContent === 'string' ? generatedContent : JSON.stringify(generatedContent, null, 2)}
//                 </pre>
//               </div>

//               <div className="flex gap-3">
//                 <button onClick={handleUseContent} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
//                   Use This Content
//                 </button>
//                 <button
//                   onClick={() => {
//                     setGeneratedContent(null);
//                     setPrompt('');
//                   }}
//                   className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
//                 >
//                   Generate Again
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
