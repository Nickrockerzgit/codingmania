import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, Award, BarChart3, Filter, Trophy, Clock, Target } from 'lucide-react';
import type { QuizResult, Technology, Level } from '../InterviewPrep';

interface DashboardProps {
  results: QuizResult[];
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ results, onBack }) => {
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<Level | 'all'>('all');

  const filteredResults = results.filter(result => {
    const techMatch = selectedTechnology === 'all' || result.technology === selectedTechnology;
    const levelMatch = selectedLevel === 'all' || result.level === selectedLevel;
    return techMatch && levelMatch;
  });

  const getStats = () => {
    if (filteredResults.length === 0) return { avgScore: 0, totalQuizzes: 0, bestScore: 0, recentScore: 0 };
    
    const avgScore = filteredResults.reduce((sum, result) => sum + result.score, 0) / filteredResults.length;
    const bestScore = Math.max(...filteredResults.map(r => r.score));
    const recentScore = filteredResults[filteredResults.length - 1]?.score || 0;
    
    return {
      avgScore: Math.round(avgScore),
      totalQuizzes: filteredResults.length,
      bestScore,
      recentScore
    };
  };

  const getTechnologyStats = () => {
    const techStats: Record<string, { count: number; avgScore: number; total: number }> = {};
    
    filteredResults.forEach(result => {
      if (!techStats[result.technology]) {
        techStats[result.technology] = { count: 0, avgScore: 0, total: 0 };
      }
      techStats[result.technology].count++;
      techStats[result.technology].total += result.score;
    });

    Object.keys(techStats).forEach(tech => {
      techStats[tech].avgScore = Math.round(techStats[tech].total / techStats[tech].count);
    });

    return techStats;
  };

  const getRecentActivity = () => {
    return filteredResults
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const stats = getStats();
  const techStats = getTechnologyStats();
  const recentActivity = getRecentActivity();

  const technologies = ['all', ...Array.from(new Set(results.map(r => r.technology)))];
  const levels = ['all', 'beginner', 'intermediate', 'experienced'];

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-20 px-10 pb-10">

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white">Performance Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedTechnology}
              onChange={(e) => setSelectedTechnology(e.target.value as Technology | 'all')}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {technologies.map(tech => (
                <option key={tech} value={tech} className="capitalize">
                  {tech === 'all' ? 'All Technologies' : tech}
                </option>
              ))}
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as Level | 'all')}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {levels.map(level => (
                <option key={level} value={level} className="capitalize">
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No quiz results found</p>
            <p className="text-gray-500">Take some quizzes to see your performance data</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.avgScore}%</h3>
                <p className="text-gray-400">Average Score</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.totalQuizzes}</h3>
                <p className="text-gray-400">Total Quizzes</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.bestScore}%</h3>
                <p className="text-gray-400">Best Score</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.recentScore}%</h3>
                <p className="text-gray-400">Recent Score</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  Technology Performance
                </h2>
                <div className="space-y-4">
                  {Object.entries(techStats).map(([tech, data]) => (
                    <div key={tech} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300 capitalize">{tech}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">{data.count} quizzes</span>
                        <span className="text-white font-semibold">{data.avgScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((result, index) => (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium capitalize">{result.technology}</p>
                        <p className="text-gray-400 text-sm capitalize">{result.level} • {new Date(result.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{result.score}%</p>
                        <p className="text-gray-400 text-sm">{result.correctAnswers}/{result.totalQuestions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Score Progression</h2>
              <div className="h-64 flex items-end justify-center space-x-2">
                {filteredResults.slice(-10).map((result, index) => (
                  <div key={result.id} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all duration-300 hover:from-blue-500 hover:to-purple-500"
                      style={{ height: `${(result.score / 100) * 200}px` }}
                    ></div>
                    <p className="text-xs text-gray-400 mt-2 rotate-45">{result.technology}</p>
                    <p className="text-xs text-gray-500">{result.score}%</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;