import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-700 text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
        Welcome to AutoForm
      </h1>
      <p className="text-lg text-center mb-10 max-w-xl">
        Easily create tests and take them instantly — all in one place!
      </p>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/create")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md transition"
        >
          Create a Test
        </button>
        <button
          onClick={() => navigate("/test")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md transition"
        >
          Give a Test
        </button>
      </div>
    </div>
  );
}
