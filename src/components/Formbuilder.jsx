import React, { useState } from "react";
import QuestionCard from "./QuestionCard";
import { LuFileQuestion } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";

function Formbuilder() {
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const addQuestion = (type) => {
    let newQuestion;
    if (type === "categorize") {
      newQuestion = {
        id: uuidv4(),
        type: "categorize",
        title: "",
        categories: [
          { id: uuidv4(), name: "Category 1" },
          { id: uuidv4(), name: "Category 2" }
        ],
        items: [
          { id: uuidv4(), text: "item 1", category: null },
          { id: uuidv4(), text: "item 2", category: null }
        ]
      };
    } 
    else if (type === "cloze") {
      newQuestion = {
        id: uuidv4(),
        type: "cloze",
        text: "JavaScript is a [blank] and React is a [blank]",
        options: [
          { id: uuidv4(), text: "programming language" },
          { id: uuidv4(), text: "library" }
        ],
        correctOptionIds: ["", ""]
      };
    } 
    else if (type === "comprehension") {
      newQuestion = {
        id: uuidv4(),
        type: "comprehension",
        passageTitle: "",
        passageText: "",
        questions: [
          {
            id: uuidv4(),
            text: "",
            options: [
              { id: uuidv4(), text: "" },
              { id: uuidv4(), text: "" }
            ],
            correctOptionId: null
          }
        ]
      };
    }
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveTest = async () => {
    if (!formTitle.trim()) {
      alert("Please enter a form title.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }


    console.log(formTitle,formDescription,questions)

    try {
      const res = await fetch("http://localhost:5000/api/tests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          questions: questions
        })
      });

      
      if (res.ok) {
        const savedTest = await res.json();
        console.log("Test saved:", savedTest);
        alert("Test saved successfully!");
        setFormTitle("");
        setFormDescription("");
        setQuestions([]);
        
      } else {
        console.error("Failed to save test");
        alert("Error saving test.");
      }
    } catch (err) {
      console.error("Error saving test:", err);
      alert("Error saving test.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-800 to-slate-800 flex flex-col items-center py-8 px-2">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl mb-6 font-bold text-orange-200 text-center tracking-wider">
          Custom Form Builder
        </h1>

        <div className="w-full max-w-6xl items-center p-3 rounded-xl shadow border-2 border-zinc-400 flex gap-4 mx-auto mb-8 bg-zinc-700">
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="text-orange-100 text-lg font-medium" htmlFor="formTitle">
                Form Title
              </label>
              <input
                className="bg-zinc-200 p-1 rounded-lg w-full"
                type="text"
                id="formTitle"
                placeholder="Enter form title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-orange-100 text-lg font-medium" htmlFor="formDescription">
                Form Description
              </label>
              <textarea
                className="bg-zinc-200 p-1 rounded-lg w-full"
                id="formDescription"
                placeholder="Enter form description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-4 flex flex-col items-center w-40">
            <div className="w-40 mb-2 h-40 border-2 flex flex-col items-center justify-center border-dashed bg-zinc-600 rounded-lg">
              <label className="text-gray-200 text-sm font-medium select-none cursor-default">
                Header Image
              </label>
            </div>
            <input
              className="bg-zinc-200 p-1 rounded-lg w-full"
              type="file"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-4xl w-full">
        <div className="flex-1 space-y-6">
          {questions.length === 0 && (
            <div className="bg-zinc-700 border border-zinc-500 rounded-lg text-zinc-300 p-10 text-center flex flex-col items-center justify-center">
              <LuFileQuestion className="mb-4 text-6xl text-zinc-400" />
              <p className="text-2xl font-semibold mb-1">No questions yet.</p>
              <p className="text-base max-w-xs text-zinc-400">
                Add your first question to get started.
              </p>
            </div>
          )}

          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onChange={(updatedQ) => {
                setQuestions((prev) => prev.map((qu) => (qu.id === q.id ? updatedQ : qu)));
              }}
              onRemove={removeQuestion}
            />
          ))}
        </div>

        <div className="w-full lg:w-1/4 lg:ml-12">
          <div className="bg-zinc-700 border border-zinc-500 rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="font-semibold text-zinc-200 mb-4 text-lg">
              Add Question
            </h2>
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => addQuestion("categorize")}
                className="bg-zinc-600 hover:bg-zinc-500 text-zinc-100 font-semibold rounded py-2 transition"
              >
                Categorize
              </button>
              <button
                onClick={() => addQuestion("cloze")}
                className="bg-zinc-600 hover:bg-zinc-500 text-zinc-100 font-semibold rounded py-2 transition"
              >
                Cloze
              </button>
              <button
                onClick={() => addQuestion("comprehension")}
                className="bg-zinc-600 hover:bg-zinc-500 text-zinc-100 font-semibold rounded py-2 transition"
              >
                Comprehension
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center w-full max-w-4xl">
        <button
          onClick={handleSaveTest}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-200 w-full lg:w-auto"
        >
          Save Test
        </button>
      </div>
    </div>
  );
}

export default Formbuilder;
