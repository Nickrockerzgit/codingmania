import  { useState, useEffect } from 'react';
import { Brain, Clock, Trophy, BarChart3, ChevronRight, Play, CheckCircle, XCircle } from 'lucide-react';
import TopicSelection from './components/TopicSelection';
import LevelSelection from './components/LevelSelection';
import QuizInterface from './components/QuizInterface';
import Results from './components/Results';
import Dashboard from './components/Dashboard';

export type Technology = 'react' | 'html' | 'css' | 'javascript' | 'nodejs' | 'mysql' | 'dsa' | 'aptitude' | 'java' | 'python' | 'cpp';
export type Level = 'beginner' | 'intermediate' | 'experienced';

export interface QuizConfig {
  technology: Technology;
  level: Level;
  totalQuestions: number;
  mcqCount: number;
  textCount: number;
  timeLimit: number; // in minutes
}

export interface Question {
  id: string;
  type: 'mcq' | 'text';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  technology: Technology;
  level: Level;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  date: string;
  answers: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    question: string;
    correctAnswer?: string;
  }>;
}

export type AppState = 'home' | 'topic-selection' | 'level-selection' | 'quiz' | 'results' | 'dashboard';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const savedResults = localStorage.getItem('interview-results');
    if (savedResults) {
      setAllResults(JSON.parse(savedResults));
    }
  }, []);

  const handleTechnologySelect = (technology: Technology) => {
    setSelectedTechnology(technology);
    setCurrentState('level-selection');
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    
    const config: QuizConfig = {
      technology: selectedTechnology!,
      level,
      totalQuestions: level === 'beginner' ? 7 : level === 'intermediate' ? 15 : 30,
      mcqCount: level === 'beginner' ? 5 : level === 'intermediate' ? 10 : 22,
      textCount: level === 'beginner' ? 2 : level === 'intermediate' ? 5 : 8,
      timeLimit: level === 'beginner' ? 15 : level === 'intermediate' ? 30 : 60
    };
    
    setQuizConfig(config);
    setCurrentState('quiz');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setCurrentResult(result);
    const updatedResults = [...allResults, result];
    setAllResults(updatedResults);
    localStorage.setItem('interview-results', JSON.stringify(updatedResults));
    setCurrentState('results');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
    setSelectedTechnology(null);
    setSelectedLevel(null);
    setQuizConfig(null);
    setCurrentResult(null);
  };

  const handleViewDashboard = () => {
    setCurrentState('dashboard');
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'home':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-4xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-3xl opacity-20 rounded-full"></div>
                <div className="relative">
                  <Brain className="w-24 h-24 mx-auto text-blue-400 mb-6" />
                  
                  <p className="text-xl text-gray-300 mb-8">
                    AI-Powered Interview Preparation Platform
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                  <Clock className="w-12 h-12 text-green-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white mb-2">Timed Practice</h3>
                  <p className="text-gray-400">Experience real interview conditions with time constraints</p>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                  <Trophy className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white mb-2">Multiple Levels</h3>
                  <p className="text-gray-400">Choose from beginner, intermediate, or experienced levels</p>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                  <BarChart3 className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white mb-2">Performance Tracking</h3>
                  <p className="text-gray-400">Monitor your progress with detailed analytics</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => setCurrentState('topic-selection')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  <span>Start Interview Practice</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {allResults.length > 0 && (
                  <button
                    onClick={handleViewDashboard}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600 hover:border-gray-500 flex items-center justify-center space-x-3 mx-auto"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>View Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'topic-selection':
        return <TopicSelection onTechnologySelect={handleTechnologySelect} onBack={handleBackToHome} />;
      
      case 'level-selection':
        return (
          <LevelSelection
            technology={selectedTechnology!}
            onLevelSelect={handleLevelSelect}
            onBack={() => setCurrentState('topic-selection')}
          />
        );
      
      case 'quiz':
        return (
          <QuizInterface
            config={quizConfig!}
            onQuizComplete={handleQuizComplete}
            onBack={() => setCurrentState('level-selection')}
          />
        );
      
      case 'results':
        return (
          <Results
            result={currentResult!}
            onBackToHome={handleBackToHome}
            onViewDashboard={handleViewDashboard}
          />
        );
      
      case 'dashboard':
        return <Dashboard results={allResults} onBack={handleBackToHome} />;
      
      default:
        return null;
    }
  };

  return <div className="min-h-screen bg-black">{renderCurrentState()}</div>;
}

export default App;