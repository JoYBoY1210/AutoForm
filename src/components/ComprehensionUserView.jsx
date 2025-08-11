import React, { useState, useEffect } from "react";

function ComprehensionUserView({ data, onChange }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (onChange) {
      onChange(answers);
    }
  }, [answers]);

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      
      <div className="mb-6 p-4 border rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
        {/* <h2 className="text-lg font-semibold mb-2">{data.passageTitle}</h2> */}
        <p className="text-gray-900 text-lg whitespace-pre-line">{data.passage}</p>
      </div>

      
      <div className="space-y-6">
        {data.questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm"
          >
            <h3 className="font-medium text-gray-800 mb-3">
              {idx + 1}. {q.text}
            </h3>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleAnswerChange(q.id, opt.id)}
                    className="text-indigo-500 focus:ring-indigo-400"
                  />
                  <span className="text-gray-700">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComprehensionUserView;
