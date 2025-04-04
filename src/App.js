import React, { useState, useEffect } from 'react';
import { quizData } from './data/quizData';
import QuizSelector from './components/QuizSelector';
import Quiz from './components/Quiz';
import { storeQuizResults, testConnection } from './services/quizStorage';
import './styles/App.css';

function App() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(null);
  const [answers, setAnswers] = useState({});
  const [storageStatus, setStorageStatus] = useState('checking');

  useEffect(() => {
    const verifyStorage = async () => {
      try {
        await testConnection();
        setStorageStatus('connected');
      } catch (error) {
        console.error('Storage connection failed:', error);
        setStorageStatus('error');
      }
    };
    verifyStorage();
  }, []);

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setQuizComplete(false);
    setScore(null);
    setAnswers({});
  };

  const handleQuizComplete = async (finalScore, userAnswers) => {
    setQuizComplete(true);
    setScore(finalScore);
    setAnswers(userAnswers);

    try {
      // For now, using a temporary user ID. In a real app, this would come from authentication
      const userId = 'temp_user';
      await storeQuizResults(userId, selectedLesson.id, finalScore, userAnswers);
    } catch (error) {
      console.error('Failed to store quiz results:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleRestart = () => {
    setSelectedLesson(null);
    setQuizComplete(false);
    setScore(null);
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  Science Quiz
                </h1>
                {storageStatus === 'error' && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    Warning: Unable to connect to storage. Quiz results will not be saved.
                  </div>
                )}
                {!selectedLesson ? (
                  <QuizSelector
                    lessons={quizData.lessons}
                    onLessonSelect={handleLessonSelect}
                  />
                ) : (
                  <Quiz
                    lesson={selectedLesson}
                    onComplete={handleQuizComplete}
                    onRestart={handleRestart}
                    isComplete={quizComplete}
                    score={score}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 