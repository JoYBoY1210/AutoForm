import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { DndContext}from "@dnd-kit/core";
import { closestCenter,KeyboardSensor,PointerSensor,useSensor,useSensors} from "@dnd-kit/core";
import { SortableContext, arrayMove,sortableKeyboardCoordinates,verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem"; 
import { v4 } from "uuid";





function Cloze({ onChange, onDelete }) {
  


  const [newOption, setNewOption] = useState("");

  const [question, setQuestion] = useState(
    {
      id: v4(),
      text: "JavaScript is a [blank] and React is a [blank]",
      options: [
        { id: v4(), text: "programming language" },
        { id: v4(), text: "framework" },
      ],
      correctOptionIds: [],
    }
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  console.log(question);

  useEffect(()=>{
    if(onChange){
      onChange(question);
    }
  }, [question, onChange]);

  const handleTextChange=(e)=>{
    const newText=e.target.value;
    const blankCount=newText.split(/\[blank\]/i).length - 1;
    setQuestion((prev)=>({
      ...prev,
      text: newText,
      correctOptionIds:Array.from({length:blankCount},(_,i)=>prev.correctOptionIds[i] || null)
    }))
  }

  const handleAddOption=()=>{
    if(newOption.trim()==""){
      return;
    }
    setQuestion((prev)=>({
      ...prev,
      options:[...prev.options,{id:v4(),text:newOption}],
      
    }))
    setNewOption("");
  }

  const handleDeleteOption=(id)=>{
    setQuestion((prev)=>({
      ...prev,
      options:prev.options.filter((option)=>option.id!==id),
      correctOptionIds:prev.correctOptionIds.map((correct)=>(correct===id ? null : correct))
    }));
  }
  const handleDragEnd=(event)=>{
    const {active,over}=event;
    if(active.id!==over.id){

        const oldIndex=question.options.findIndex((option)=>option.id===active.id);
        const newIndex=question.options.findIndex((option)=>option.id===over.id);
        setQuestion((prev)=>({
          ...prev,
          options:arrayMove(prev.options, oldIndex, newIndex),
          correctOptionIds:arrayMove(prev.correctOptionIds, oldIndex, newIndex)
        }));
    }
  }

  const handleCorrectAnswerChange = (blankIdx, optionId) => {
    setQuestion((prev) => {
      const updated = [...prev.correctOptionIds];
      updated[blankIdx] = optionId || null;
      return { ...prev, correctOptionIds: updated };
    });
  };

  // const handleTextChange = (e) => {
  //   setText(e.target.value);
  //   if (onChange) {
  //     onChange(e.target.value);
  //   }
  // };

  const renderPreview = () => {
    const parts = question.text.split(/\[blank\]/i);
    return (
      <div className="flex flex-wrap gap-2 mt-4 text-lg items-center">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center whitespace-pre-wrap">
            <span>{part}</span>
            {i < parts.length - 1 && (
              <select
                value={question.correctOptionIds[i] || ""}
                onChange={(e) => handleCorrectAnswerChange(i, e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 mx-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
              >
                <option value="">Select answer</option>
                {question.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.text}</option>
                ))}
              </select>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <label htmlFor="cloze-textarea" className="block font-semibold text-gray-700 mb-3 text-lg">
        Cloze Question
      </label>
      <div className="flex justify-end mb-4">
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition"
          title="Delete Question"
        >
          <MdDelete className="w-6 h-6" />
        </button>
      </div>

      <textarea
        id="cloze-textarea"
        className="w-full border border-gray-300 rounded-md p-1.5 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 shadow-sm transition"
        value={question.text}
        onChange={handleTextChange}
        placeholder="Type your paragraph with [blank] where you want the user to fill."
      />

      <h4 className="mt-6 mb-2 font-semibold text-gray-800 text-lg">Live Preview:</h4>
      <div className="bg-gray-50 p-5 rounded-md border border-gray-200 min-h-[4rem]">
        {renderPreview()}
      </div>

      <h4 className="mt-6 font-semibold">Answer Options:</h4>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          className="border px-2 py-1 rounded w-64"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Enter option"
        />
        <button
          onClick={handleAddOption}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={question.options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
          <ul className="mt-4 space-y-2 flex flex-col">
            {question.options.map((option) => (
              <li key={option.id} className="flex items-center gap-2 min-w-full">
                <SortableItem
                  id={option.id}
                  text={option.text}
                  className="bg-white border w-full px-4 py-2 rounded shadow cursor-move"
                />
                <MdDelete
                  className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteOption(option.id)}
                />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Cloze;
