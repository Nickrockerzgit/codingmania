
// QuizInterface.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, ArrowRight, Save } from 'lucide-react';
import type { QuizConfig, Question, QuizResult } from '../InterviewPrep';

interface QuizInterfaceProps {
  config: QuizConfig;
  onQuizComplete: (result: QuizResult) => void;
  onBack: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ config, onQuizComplete, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(config.timeLimit * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, submitting]);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/quiz/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technology: config.technology,
          level: config.level,
          mcqCount: config.mcqCount,
          textCount: config.textCount,
        }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const correct = questions.filter(q => {
      const ans = answers[q.id];
      return q.type === 'mcq' && ans === q.correctAnswer;
    }).length;

    const result: QuizResult = {
      id: Date.now().toString(),
      technology: config.technology,
      level: config.level,
      score: Math.round((correct / questions.length) * 100),
      totalQuestions: questions.length,
      correctAnswers: correct,
      timeTaken: config.timeLimit * 60 - timeLeft,
      date: new Date().toISOString(),
      answers: questions.map(q => ({
        questionId: q.id,
        userAnswer: answers[q.id],
        isCorrect: q.type === 'mcq' ? answers[q.id] === q.correctAnswer : !!answers[q.id],
        question: q.question,
        correctAnswer: q.correctAnswer,
      })),
    };

    setTimeout(() => onQuizComplete(result), 1000);
  };

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Generating questions...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Submitting your answers...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];


  return (
    <div className="min-h-screen bg-[#050505] py-8 pt-16">
      <div className="min-h-screen bg-[#050505] p-4">
       <div className="max-w-4xl mx-auto">
         <div className="flex items-center justify-between mb-6">
           <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Levels</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" />
              <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-gray-300 capitalize">{config.technology} - {config.level}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{currentQuestion.question}</h2>
            
            {currentQuestion.type === 'mcq' ? (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerChange(currentQuestion.id, option)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      answers[currentQuestion.id] === option
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQuestion.id] === option
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-500'
                      }`}>
                        {answers[currentQuestion.id] === option && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-10 rounded-lg border-2 transition-all duration-200 ${
                index === currentQuestionIndex
                  ? 'border-red-500 bg-red-500/20 text-red-400'
                  : answers[questions[index].id]
                  ? 'border-green-500 bg-green-500/20 text-green-300'
                  : 'border-gray-600 hover:border-gray-500 text-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default QuizInterface;
