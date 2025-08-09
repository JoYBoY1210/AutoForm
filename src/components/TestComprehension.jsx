import React from 'react'
import ComprehensionUserView from './ComprehensionUserView';
import { useState } from 'react';

function TestComprehension() {
  const passageText = `JavaScript is one of the most popular programming languages.
It is mainly used for web development along with HTML and CSS.`;

  const questions = [
    {
      id: "q1",
      text: "What is JavaScript mainly used for?",
      options: [
        { id: "o1", text: "Game Development" },
        { id: "o2", text: "Web Development" },
        { id: "o3", text: "Operating Systems" },
      ],
    },
    {
      id: "q2",
      text: "Which two languages are often used with JavaScript?",
      options: [
        { id: "o4", text: "HTML and CSS" },
        { id: "o5", text: "Python and Java" },
        { id: "o6", text: "C++ and Rust" },
      ],
    },
  ];

  const handleAnswersChange = (answers) => {
    console.log("User answers:", answers);
  };

  return (
    <div className="p-8">
      <ComprehensionUserView
        passage={passageText}
        questions={questions}
        onChange={handleAnswersChange}
      />
    </div>
  );
}

export default TestComprehension
