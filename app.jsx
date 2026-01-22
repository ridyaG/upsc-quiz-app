import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import ReactDOM from 'react-dom/client';
import UPSCQuizApp from './app.jsx';

export default function UPSCQuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load questions from JSON file
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/public/questions.json');
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await response.json();
      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      setError('Unable to load questions. Please try again later.');
      setLoading(false);
    }
  };

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  const getButtonColor = (index) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-blue-50 border-2 border-gray-300';
    }
    
    if (index === questions[currentQuestion].correct) {
      return 'bg-green-100 border-2 border-green-500';
    }
    
    if (index === selectedAnswer && index !== questions[currentQuestion].correct) {
      return 'bg-red-100 border-2 border-red-500';
    }
    
    return 'bg-gray-100 border-2 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadQuestions}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = ((score / questions.length) * 100).toFixed(1);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <Award className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 mb-6">
            <p className="text-6xl font-bold mb-2">{score}/{questions.length}</p>
            <p className="text-2xl">Score: {percentage}%</p>
          </div>
          
          <div className="mb-6 text-left bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">Performance Summary:</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Correct Answers:</span>
                <span className="font-semibold text-green-600">{score}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Incorrect Answers:</span>
                <span className="font-semibold text-red-600">{questions.length - score}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold text-blue-600">{percentage}%</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center mx-auto gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <h1 className="text-3xl font-bold text-center mb-2">UPSC Practice Quiz</h1>
            <p className="text-center text-blue-100">Test Your Knowledge</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-8">
            {/* Question Counter */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                Score: {score}
              </span>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-300 transform hover:scale-102 ${getButtonColor(index)} ${
                    selectedAnswer === null ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg text-gray-800 font-medium">{option}</span>
                    {selectedAnswer !== null && index === question.correct && (
                      <CheckCircle className="ml-auto text-green-600 w-7 h-7 flex-shrink-0" />
                    )}
                    {selectedAnswer === index && index !== questions[currentQuestion].correct && (
                      <XCircle className="ml-auto text-red-600 w-7 h-7 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mb-6 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <h3 className="font-bold text-lg text-blue-900 mb-2">Explanation:</h3>
                <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {selectedAnswer !== null && (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">Practice makes perfect! Keep learning 📚</p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UPSCQuizApp />
  </React.StrictMode>
);
