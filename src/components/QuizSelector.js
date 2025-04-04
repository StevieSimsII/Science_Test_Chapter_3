import React from 'react';

function QuizSelector({ lessons, onLessonSelect }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">Select a Quiz</h2>
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onLessonSelect(lesson)}
            className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <h3 className="text-lg font-medium text-blue-900">{lesson.title}</h3>
            <p className="text-sm text-blue-600">
              {lesson.questions.length} questions
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizSelector; 