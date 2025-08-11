import React, { useState } from "react";
import UserTestView from "../components/UserTestView";

function TestGivePage() {
  const [testId, setTestId] = useState("");
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testId.trim()) {
      alert("Please enter a test ID.");
      return;
    }

    setLoading(true);
    fetch(`/api/tests/${testId}`)
      .then((res) => res.json())
      .then((data) => {
        setTestData(data?.questions || []);
        setTitle(data?.title || "");
        setDescription(data?.description || "");
        setShowTest(true);
      })
      .catch((err) => {
        console.error("Error fetching test data:", err);
        alert("Failed to load test data.");
      })
      .finally(() => setLoading(false));
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading test...
      </div>
    );
  }

  
  

  
  if (showTest) {
    return (
      <UserTestView
        title={title}
        description={description}
        testData={testData}
      />
    );
  }


  return (
    <div className="bg-zinc-700 flex items-center justify-center min-h-screen px-4">
      <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-zinc-100 font-bold text-3xl mb-6 text-center">
          Enter Test ID
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="inputId"
            placeholder="e.g. 64fe12ab34c..."
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-zinc-900 text-zinc-100 placeholder-zinc-400"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Start Test
          </button>
        </form>
      </div>
    </div>
  );
}

export default TestGivePage;
