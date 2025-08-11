import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RxCross2 } from 'react-icons/rx';
import { IoIosMenu } from "react-icons/io";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

function SortableOption({
  id,
  option,
  correct,
  onChange,
  onRemove,
  onMarkCorrect
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-2 bg-gray-50 rounded p-2 shadow border border-gray-300 mb-2"
    >
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded p-2 focus:outline-none"
        value={option.text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Option text"
      />
      <label className="flex items-center gap-1 select-none">
        <input
          type="radio"
          checked={correct}
          onChange={onMarkCorrect}
        />
        <span className="text-xs">Correct</span>
      </label>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 px-2"
        title="Remove option"
        type="button"
      >
        <RxCross2 className="text-red-600 text-xl" />
      </button>
      <span {...listeners} className="text-gray-400 cursor-move select-none"><IoIosMenu className="text-xl" /></span>
    </div>
  );
}

export default function Comprehension({ question: initialQuestion, onChange, onDelete }) {
  const [localQuestion, setLocalQuestion] = useState(
    initialQuestion || {
      id: uuidv4(),
      type: "comprehension",
      passage: "",
      questions: [
        {
          id: uuidv4(),
          text: '',
          options: [
            { id: uuidv4(), text: '' },
            { id: uuidv4(), text: '' }
          ],
          correctOptionId: ''
        }
      ]
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: null }) 
  );

  useEffect(() => {
    if (onChange) onChange(localQuestion);
  }, [localQuestion]);

  const handlePassageChange = (e) => setLocalQuestion(prev => ({ ...prev, passage: e.target.value }));

  const handleQuestionChange = (questionId, value) => {
    setLocalQuestion(prev => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, text: value } : q))
    }));
  };

  const handleOptionChange = (questionId, optionId, value) => {
    setLocalQuestion(prev => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        const newOpts = q.options.map((opt) =>
          opt.id === optionId ? { ...opt, text: value } : opt
        );
        return { ...q, options: newOpts };
      })
    }));
  };

  const handleAddOption = (questionId) => {
    setLocalQuestion(prev => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...q.options, { id: uuidv4(), text: '' }]
            }
          : q
      )
    }));
  };

  const handleRemoveOption = (questionId, optionId) => {
    const question = localQuestion.questions.find(q => q.id === questionId);
    if (!question) return;
    if (question.id === questionId && question.options.length <= 2) {
      alert("At least two options are required.");
      return;
    }
    setLocalQuestion(prev => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        let newOpts = q.options.filter((opt) => opt.id !== optionId);
        let newCorrectId = q.correctOptionId === optionId ? null : q.correctOptionId;
        return { ...q, options: newOpts, correctOptionId: newCorrectId };
      })
    }));
  };

  const handleMarkCorrect = (questionId, optionId) => {
    setLocalQuestion(prev => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, correctOptionId: optionId } : q
      )
    }));
  };

  const handleAddQuestion = () => {
    setLocalQuestion(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: uuidv4(),
          text: '',
          options: [
            { id: uuidv4(), text: '' },
            { id: uuidv4(), text: '' }
          ],
          correctOptionId: null
        }
      ]
    }));
  };

  const handleRemoveQuestion = (questionId) => {
    setLocalQuestion(prev => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId)
    }));
  };

  const handleDragEnd = (questionId, event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setLocalQuestion(prev => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== questionId) return q;
          const oldIndex = q.options.findIndex((o) => o.id === active.id);
          const newIndex = q.options.findIndex((o) => o.id === over.id);
          const newOpts = arrayMove(q.options, oldIndex, newIndex);
          return { ...q, options: newOpts };
        })
      }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow space-y-10">
      <h2 className="text-3xl font-bold mb-6">Comprehension Editor</h2>

      <div>
        <label htmlFor="passage" className="block font-semibold mb-2 text-lg">
          Passage:
        </label>
        <textarea
          id="passage"
          className="w-full border border-gray-300 rounded p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          value={localQuestion.passage}
          onChange={handlePassageChange}
          placeholder="Type the comprehension passage here..."
        />
      </div>

      {localQuestion.questions.map((q, qIndex) => (
        <div
          key={q.id}
          className="bg-gray-50 rounded-lg p-6 shadow border border-gray-200 relative"
        >
          {localQuestion.questions.length > 1 && (
            <button
              onClick={() => handleRemoveQuestion(q.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              title="Remove question"
              type="button"
            >
              <RxCross2 className="text-2xl" />
            </button>
          )

          }

          <label
            htmlFor={`question-${q.id}`}
            className="block font-semibold mb-2 text-lg"
          >
            Question {qIndex + 1}
          </label>
          <input
            id={`question-${q.id}`}
            type="text"
            className="w-full border border-gray-300 rounded p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={q.text}
            onChange={(e) => handleQuestionChange(q.id, e.target.value)}
            placeholder="Enter question text"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(q.id, e)}
          >
            <SortableContext
              items={q.options.map((o) => o.id)}
              strategy={verticalListSortingStrategy}
            >
              {q.options.map((option, idx) => (
                <SortableOption
                  key={option.id}
                  id={option.id}
                  questionIndex={qIndex}
                  option={option}
                  correct={q.correctOptionId === option.id}
                  onChange={(val) =>
                    handleOptionChange(q.id, option.id, val)
                  }
                  onRemove={() => handleRemoveOption(q.id, option.id)}
                  onMarkCorrect={() => handleMarkCorrect(q.id, option.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            onClick={() => handleAddOption(q.id)}
            className="mt-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-200 transition font-medium"
            type="button"
          >
            Add Option
          </button>
        </div>
      ))}

      <button
        onClick={handleAddQuestion}
        className="bg-orange-100 text-orange-700 px-6 py-3 rounded-lg hover:bg-orange-200 transition font-semibold"
        type="button"
      >
        Add New Question
      </button>
    </div>
  );
}
