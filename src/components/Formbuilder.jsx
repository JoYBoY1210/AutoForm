import React, { useState } from "react";
import QuestionCard from "./QuestionCard";
import { LuFileQuestion } from "react-icons/lu";

function Formbuilder() {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      { type, id: Date.now() }
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
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

          {questions.map((q,i) => (
            <QuestionCard key={i} id={q.id} type={q.type} onRemove={removeQuestion} />
          ))}
        </div>

        
        <div className="w-full lg:w-1/4 lg:ml-12">
          <div className="bg-zinc-700 border border-zinc-500 rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="font-semibold text-zinc-200 mb-4 text-lg">Add Question</h2>
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

    </div>
  );
}

export default Formbuilder;
