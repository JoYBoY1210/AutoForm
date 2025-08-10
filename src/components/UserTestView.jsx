import React, { useCallback, useState } from "react";
import CategorizeUserView from "./CategorizeUserView";
import ClozeUserView from "./ClozeUserView";
import ComprehensionUserView from "./ComprehensionUserView";

export default function UserTestView({ testData }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleAnswerChange = useCallback((questionId, answerData) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerData,
    }));
  }, []);

  const calculateScore = () => {
    let correctCount = 0;
    let total = 0;

    testData.forEach((q) => {
      if (q.type === "categorize") {
        total++;
        const userCats = answers[q.id] || {};
        let allCorrect = true;
        for (let catId in userCats) {
          userCats[catId].forEach((item) => {
            if (item.correctCategoryId !== catId) {
              allCorrect = false;
            }
          });
        }
        if (allCorrect) correctCount++;
      }

      if (q.type === "cloze") {
        total++;
        const userAns = answers[q.id] || [];
        if (
          userAns.length === q.correctOptionIds.length &&
          userAns.every((val, idx) => val === q.correctOptionIds[idx])
        ) {
          correctCount++;
        }
      }

      if (q.type === "comprehension") {
        q.questions.forEach((mcq) => {
          total++;
          const userAns = answers[q.id]?.[mcq.id];
          if (userAns === mcq.correctOptionId) {
            correctCount++;
          }
        });
      }
    });

    setScore(correctCount);
    setTotalQuestions(total);
  };

//   console.log(totalQuestions, score, answers);

  const handleSubmit = () => {
    calculateScore();
    // window.scrollTo({ top: 0, behavior: "smooth" });
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

        {score !== null && (
          <div className="mt-10 text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Test Results
            </h2>
            <p className="mt-3 text-lg text-gray-700">
              You scored{" "}
              <span
                className={`font-bold ${
                  score / totalQuestions >= 0.5 ? "text-green-600" : "text-red-600"
                }`}
              >
                {score}
              </span>{" "}
              out of{" "}
              <span className="font-bold text-gray-800">{totalQuestions}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
