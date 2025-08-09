import React from 'react'
import ClozeUserView from './ClozeUserView';
import { useState } from 'react';
import { useCallback } from 'react';

function TextCloze() {
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = useCallback((id, userAnswers) => {
    setAnswers((prev) => ({ ...prev, [id]: userAnswers }));
  }, []);

  const question = {
    id: "q1",
    text: "JavaScript is a [blank] and React is a [blank]",
    options: [
      { id: "1", text: "programming language" },
      { id: "2", text: "framework" },
      { id: "3", text: "library" },
    ],
    correctOptionIds: ["1", "3"], 
  };

//   console.log(answers);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <ClozeUserView question={question} onAnswerChange={handleAnswerChange} />
        
        
      </div>
    </div>
  );
}

export default TextCloze
