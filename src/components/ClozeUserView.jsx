import React, { useState, useEffect } from "react";

function ClozeUserView({ question, onAnswerChange }) {
    
  const [answers, setAnswers] = useState(
    Array.from({ length: question.correctOptionIds.length }, () => "")
  );

  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(answers);
    }
  }, [answers, question.id]);

//   console.log(answers);

  const handleSelectChange = (blankIdx, value) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[blankIdx] = value;
      return updated;
    });
  };

  const renderQuestion = () => {
    const parts = question.text.split(/\[blank\]/i);
    return (
      <div className="flex flex-wrap gap-2 items-center text-lg leading-relaxed">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center whitespace-pre-wrap">
            <span className="text-gray-800">{part}</span>
            {i < parts.length - 1 && (
              <select
                value={answers[i] || ""}
                onChange={(e) => handleSelectChange(i, e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 mx-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition bg-white text-gray-700"
              >
                <option value="">Select answer</option>
                {question.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.text}
                  </option>
                ))}
              </select>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-800 mb-4 text-xl">Fill in the blanks</h3>
      <div className="bg-gray-50 p-5 rounded-md border border-gray-200 min-h-[4rem]">
        {renderQuestion()}
      </div>
    </div>
  );
}

export default ClozeUserView;
