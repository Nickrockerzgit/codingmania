import React from 'react';
import { Trophy, Clock, CheckCircle, XCircle, BarChart3, Home, Eye } from 'lucide-react';
import type { QuizResult } from '../InterviewPrep';

interface ResultsProps {
  result: QuizResult;
  onBackToHome: () => void;
  onViewDashboard: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onBackToHome, onViewDashboard }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! You have a strong understanding.';
    if (score >= 60) return 'Good job! Keep practicing to improve.';
    return 'Keep learning! Practice makes perfect.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${getScoreColor(result.score)} blur-3xl opacity-20 rounded-full`}></div>
            <div className="relative">
              <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
              <h1 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h1>
              <p className="text-xl text-gray-300">{getScoreMessage(result.score)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getScoreColor(result.score)} flex items-center justify-center`}>
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{result.score}%</h3>
            <p className="text-gray-400">Final Score</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{result.correctAnswers}</h3>
            <p className="text-gray-400">Correct Answers</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{result.totalQuestions - result.correctAnswers}</h3>
            <p className="text-gray-400">Incorrect Answers</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{formatTime(result.timeTaken)}</h3>
            <p className="text-gray-400">Time Taken</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quiz Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-400">Technology</p>
              <p className="text-white font-semibold capitalize">{result.technology}</p>
            </div>
            <div>
              <p className="text-gray-400">Level</p>
              <p className="text-white font-semibold capitalize">{result.level}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Questions</p>
              <p className="text-white font-semibold">{result.totalQuestions}</p>
            </div>
            <div>
              <p className="text-gray-400">Date</p>
              <p className="text-white font-semibold">{new Date(result.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Answer Review</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {result.answers.map((answer, index) => (
              <div key={answer.questionId} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {answer.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">Q{index + 1}: {answer.question}</p>
                    <p className="text-gray-300 mb-1"><span className="font-medium">Your Answer:</span> {answer.userAnswer}</p>
                    {answer.correctAnswer && (
                      <p className="text-green-400"><span className="font-medium">Correct Answer:</span> {answer.correctAnswer}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBackToHome}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <button
            onClick={onViewDashboard}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
          >
            <BarChart3 className="w-5 h-5" />
            <span>View Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;