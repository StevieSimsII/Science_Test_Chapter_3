import React, { useState, useEffect } from 'react';

function Quiz({ lesson, onComplete, onRestart, isComplete, score }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const totalQuestions = lesson.questions.length;

  useEffect(() => {
    if (isComplete && score !== null) {
      setShowResults(true);
    }
  }, [isComplete, score]);

  const handleAnswer = (selectedAnswer) => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    setAnswers({
      ...answers,
      [currentQuestion.id]: selectedAnswer,
    });
  };

  const handleCheckAnswer = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      const finalScore = calculateScore();
      onComplete(finalScore, answers);
    }
  };

  const handlePrevious = () => {
    setShowFeedback(false);
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    lesson.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct += 1;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const renderFeedback = () => {
    if (!showFeedback) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
        <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </p>
        {!isCorrect && (
          <div className="mt-2">
            <p className="font-medium">The correct answer is:</p>
            {currentQuestion.type === 'multiple_choice' ? (
              <p className="text-gray-800">{currentQuestion.options[currentQuestion.correctAnswer]}</p>
            ) : (
              <p className="text-gray-800">{currentQuestion.correctAnswer ? 'True' : 'False'}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Quiz Results</h2>
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600">{score || calculateScore()}%</p>
          <p className="text-gray-600 mt-2">
            You got {Object.values(answers).filter(
              (answer, index) => answer === lesson.questions[index].correctAnswer
            ).length}{' '}
            out of {totalQuestions} questions correct
          </p>
        </div>
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold">Question Review</h3>
          {lesson.questions.map((question, index) => (
            <div 
              key={question.id} 
              className={`p-4 rounded-lg ${
                answers[question.id] === question.correctAnswer 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className="font-medium">{index + 1}. {question.question}</p>
              <div className="mt-2">
                {question.type === 'multiple_choice' ? (
                  <p>
                    <span className="font-medium">Correct answer: </span>
                    {question.options[question.correctAnswer]}
                  </p>
                ) : (
                  <p>
                    <span className="font-medium">Correct answer: </span>
                    {question.correctAnswer ? 'True' : 'False'}
                  </p>
                )}
                {answers[question.id] !== undefined && answers[question.id] !== question.correctAnswer && (
                  <p className="text-red-600 mt-1">
                    <span className="font-medium">Your answer: </span>
                    {question.type === 'multiple_choice' 
                      ? question.options[answers[question.id]]
                      : answers[question.id] ? 'True' : 'False'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onRestart}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Another Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        <p className="text-gray-600">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-lg mb-4">{currentQuestion.question}</p>
        <div className="space-y-2">
          {currentQuestion.type === 'multiple_choice' ? (
            currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={`w-full p-3 text-left rounded-lg transition-colors duration-200 ${
                  answers[currentQuestion.id] === index
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                disabled={showFeedback}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  answers[currentQuestion.id] === true
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                True
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={showFeedback}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  answers[currentQuestion.id] === false
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                False
              </button>
            </div>
          )}
        </div>
        
        {renderFeedback()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Previous
        </button>
        {!showFeedback ? (
          <button
            onClick={handleCheckAnswer}
            disabled={answers[currentQuestion.id] === undefined}
            className={`px-4 py-2 rounded-lg ${
              answers[currentQuestion.id] === undefined
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz; 