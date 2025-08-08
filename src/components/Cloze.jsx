import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { DndContext}from "@dnd-kit/core";
import { closestCenter,KeyboardSensor,PointerSensor,useSensor,useSensors} from "@dnd-kit/core";
import { SortableContext, arrayMove,sortableKeyboardCoordinates,verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem"; 
import { v4 } from "uuid";





function Cloze({ onChange, onDelete }) {
  const [text, setText] = useState(
    "JavaScript is a [blank] and React is a [blank]"
  );

  const [options, setOptions] = useState([
    { id: v4(), text: "programming language" },
    { id: v4(), text: "framework" },
  ]);
  const [newOption, setNewOption] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddOption=()=>{
    if(newOption.trim()==""){
      return;
    }
    setOptions((prev)=>[...prev, { id: v4(), text: newOption }]);
    setNewOption("");
  }

  const handleDeleteOption=(id)=>{
    setOptions((prev)=>prev.filter((option)=>option.id!==id));
  }
  const handleDragEnd=(event)=>{
    const {active,over}=event;
    if(active.id!==over.id){
      
        const oldIndex=options.findIndex((option)=>option.id===active.id);
        const newIndex=options.findIndex((option)=>option.id===over.id);
        setOptions(arrayMove(options, oldIndex, newIndex));
      
    }
  }



  const handleTextChange = (e) => {
    setText(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const renderPreview = () => {
    const parts = text.split(/\[blank\]/i);
    return (
      <div className="flex flex-wrap gap-2 mt-4 text-lg items-center">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center whitespace-pre-wrap">
            <span>{part}</span>
            {i < parts.length - 1 && (
              <input
                type="text"
                editable="false"
                className="border border-gray-300 rounded-md px-3 py-1 w-28 mx-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
                placeholder={`Blank ${i + 1}`}
              />
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
        className="w-full border border-gray-300 rounded-md p-1.5  resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 shadow-sm transition"
        value={text}
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
        <SortableContext items={options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
          <ul className="mt-4 space-y-2 flex flex-col">
            {options.map((option,i) => (
              <li key={option.id} className="flex items-center gap-2 min-w-full">
                <SortableItem id={option.id} text={option.text} className={"bg-white border w-full px-4 py-2 rounded shadow cursor-move"} />
                <MdDelete className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleDeleteOption(option.id)} />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Cloze;
