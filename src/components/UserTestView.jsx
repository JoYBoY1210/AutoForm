import React, { useCallback, useState } from "react";
import CategorizeUserView from "./CategorizeUserView";
import ClozeUserView from "./ClozeUserView";
import ComprehensionUserView from "./ComprehensionUserView";
import { useNavigate } from "react-router-dom";

export default function UserTestView({ testData }) {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleAnswerChange = useCallback((questionId, answerData) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerData,
    }));
  }, []);

  

//   console.log(totalQuestions, score, answers);

  const handleSubmit = () => {
    alert("Test submitted successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Take the Test
        </h1>

        <div className="space-y-10">
          {testData.map((q, idx) => {
            const questionHeader = (
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {idx + 1}.{" "}
                {q.type === "cloze"
                  ? "Fill in the blanks"
                  : q.type === "categorize"
                  ? q.title
                  : q.passageTitle}
              </h2>
            );

            return (
              <div
                key={q.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {questionHeader}

                {q.type === "categorize" && (
                  <CategorizeUserView
                    data={q}
                    onChange={(ans) => handleAnswerChange(q.id, ans)}
                  />
                )}

                {q.type === "cloze" && (
                  <ClozeUserView
                    question={q}
                    onAnswerChange={(ans) => handleAnswerChange(q.id, ans)}
                  />
                )}

                {q.type === "comprehension" && (
                  <ComprehensionUserView
                    data={q}
                    onChange={(ans) => handleAnswerChange(q.id, ans)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-lg text-lg font-medium shadow-md bg-indigo-500 hover:bg-indigo-600 text-white transform hover:-translate-y-0.5 transition duration-200"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}