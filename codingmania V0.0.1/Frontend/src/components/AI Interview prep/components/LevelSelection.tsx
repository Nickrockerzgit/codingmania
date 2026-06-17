import React from 'react';
import { ArrowLeft, Clock, FileText, CheckCircle, Star, Award, Trophy } from 'lucide-react';
import type { Technology, Level } from '../InterviewPrep';

interface LevelSelectionProps {
  technology: Technology;
  onLevelSelect: (level: Level) => void;
  onBack: () => void;
}

const levels = [
  {
    id: 'beginner' as Level,
    name: 'Beginner',
    icon: Star,
    color: 'from-green-500 to-emerald-500',
    description: 'Perfect for those starting their journey',
    questions: 7,
    mcq: 5,
    text: 2,
    time: 15,
    difficulty: 'Easy'
  },
  {
    id: 'intermediate' as Level,
    name: 'Intermediate',
    icon: Award,
    color: 'from-blue-500 to-purple-500',
    description: 'For developers with some experience',
    questions: 15,
    mcq: 10,
    text: 5,
    time: 30,
    difficulty: 'Medium'
  },
  {
    id: 'experienced' as Level,
    name: 'Experienced',
    icon: Trophy,
    color: 'from-orange-500 to-red-500',
    description: 'Challenge yourself with advanced concepts',
    questions: 30,
    mcq: 22,
    text: 8,
    time: 60,
    difficulty: 'Hard'
  }
];

const LevelSelection: React.FC<LevelSelectionProps> = ({ technology, onLevelSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Topics</span>
          </button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Select Your Level</h1>
          <p className="text-xl text-gray-300 capitalize">Choose difficulty level for {technology}</p>
        </div>
        
        <div className="space-y-6">
          {levels.map((level) => {
            const IconComponent = level.icon;
            return (
              <button
                key={level.id}
                onClick={() => onLevelSelect(level.id)}
                className="group w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-semibold text-white mb-2">{level.name}</h3>
                      <p className="text-gray-400 mb-2">{level.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${level.color} text-white font-medium`}>
                          {level.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{level.time} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <FileText className="w-4 h-4" />
                      <span>{level.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle className="w-4 h-4" />
                      <span>{level.mcq} MCQ + {level.text} Text</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;