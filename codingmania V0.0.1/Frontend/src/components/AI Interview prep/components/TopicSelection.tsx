
import React from 'react';
import { ArrowLeft , Brain, Target , Code ,TrendingUp } from 'lucide-react';
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaJava,
  FaPython,
  FaDatabase,
} from 'react-icons/fa';
import { SiJavascript, SiMysql, SiCplusplus, SiAptos } from 'react-icons/si';
import { GiArtificialHive } from 'react-icons/gi';
import { MdOutlinePsychology } from 'react-icons/md';
import { Technology } from '../InterviewPrep';

interface TopicSelectionProps {
  onTechnologySelect: (technology: Technology) => void;
  onBack: () => void;
}

const technologies = [
  { id: 'html' as Technology, name: 'HTML', icon: FaHtml5, color: 'from-orange-500 to-red-500', description: 'Markup language for web' },
  { id: 'css' as Technology, name: 'CSS', icon: FaCss3Alt, color: 'from-purple-500 to-pink-500', description: 'Styling and layout' },
  { id: 'javascript' as Technology, name: 'JavaScript', icon: SiJavascript, color: 'from-yellow-500 to-orange-500', description: 'Dynamic programming language' },
  { id: 'react' as Technology, name: 'React', icon: FaReact, color: 'from-blue-500 to-cyan-500', description: 'Component-based UI library' },
  { id: 'nodejs' as Technology, name: 'Node.js', icon: FaNodeJs, color: 'from-green-500 to-emerald-500', description: 'Server-side JavaScript runtime' },
  { id: 'mysql' as Technology, name: 'MySQL', icon: SiMysql, color: 'from-blue-600 to-indigo-600', description: 'Relational database management' },
  { id: 'dsa' as Technology, name: 'DSA', icon: GiArtificialHive, color: 'from-red-500 to-pink-500', description: 'Data Structures & Algorithms' },
  { id: 'aptitude' as Technology, name: 'Aptitude', icon: MdOutlinePsychology, color: 'from-indigo-500 to-purple-500', description: 'Logical reasoning & math' },
  { id: 'java' as Technology, name: 'Java', icon: FaJava, color: 'from-orange-600 to-red-600', description: 'Object-oriented programming' },
  { id: 'cpp' as Technology, name: 'C++', icon: SiCplusplus, color: 'from-gray-600 to-gray-800', description: 'Systems programming language' },
  { id: 'python' as Technology, name: 'Python', icon: FaPython, color: 'from-green-600 to-blue-600', description: 'High-level programming language' }
];

const TopicSelection: React.FC<TopicSelectionProps> = ({ onTechnologySelect, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Technology</h1>
          <p className="text-xl text-gray-300">Select the technology you want to practice</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {technologies.map((tech) => {
            const IconComponent = tech.icon;
            return (
              <button
                key={tech.id}
                onClick={() => onTechnologySelect(tech.id)}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tech.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-gray-400 text-sm">{tech.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-12 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-gray-700 shadow-2xl p-10 text-white">
  <div className="text-center">
    <Brain className="h-16 w-16 mx-auto mb-4 text-purple-400" />
    <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-white">Powered by Google Gemini AI</h2>
    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
      Experience next-generation interview preparation with AI-generated questions, 
      intelligent evaluation, and personalized feedback.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 backdrop-blur-sm transition hover:shadow-lg hover:border-purple-500">
        <Code className="h-8 w-8 mb-3 mx-auto text-purple-400" />
        <h3 className="font-semibold text-lg text-white mb-2">Unique Questions</h3>
        <p className="text-sm text-gray-400">AI generates fresh questions for every session.</p>
      </div>
      
      <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 backdrop-blur-sm transition hover:shadow-lg hover:border-purple-500">
        <Target className="h-8 w-8 mb-3 mx-auto text-purple-400" />
        <h3 className="font-semibold text-lg text-white mb-2">Smart Evaluation</h3>
        <p className="text-sm text-gray-400">Intelligent scoring for both MCQ and text answers.</p>
      </div>
      
      <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 backdrop-blur-sm transition hover:shadow-lg hover:border-purple-500">
        <TrendingUp className="h-8 w-8 mb-3 mx-auto text-purple-400" />
        <h3 className="font-semibold text-lg text-white mb-2">Performance Insights</h3>
        <p className="text-sm text-gray-400">Detailed analytics and improvement recommendations.</p>
      </div>
    </div>
  </div>
</div>

    
      </div>
    </div>
  );
};

export default TopicSelection;
