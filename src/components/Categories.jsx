import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RxCross2 } from 'react-icons/rx';
import { IoIosMenu } from "react-icons/io";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

function SortableCategory({ id, name, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: '1px solid #ddd',
    background: '#f8f8f8',
    marginBottom: 8,
    padding: 8,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <span {...listeners} style={{ cursor:'grab', marginRight:8, fontSize:22 }}>
        <IoIosMenu />
      </span>
      <span style={{ flex: 1 }}>{name}</span>
      <button onClick={() => onDelete(id)}>
        <RxCross2 className='text-red-500 font-bold text-2xl' />
      </button>
    </div>
  );
}

function Categories({ question: initialQuestion, onChange, onDelete }) {
  const [localQuestion, setLocalQuestion] = useState(
    initialQuestion || {
      id: uuidv4(),
      type: "categorize",
      title: "",
      categories: [
        { id: uuidv4(), name: "Category 1" },
        { id: uuidv4(), name: "Category 2" }
      ],
      items: [
        { id: uuidv4(), text: "item 1", correctCategoryId: null },
        { id: uuidv4(), text: "item 2", correctCategoryId: null }
      ]
    }
  );

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  
  useEffect(() => {
    if (onChange) onChange(localQuestion);
  }, [localQuestion]);

  const categories = localQuestion.categories;
  const items = localQuestion.items;

  const handleCategoryDelete = (id) => {
    setLocalQuestion(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
      items: prev.items.map(item =>
        item.category === id ? { ...item, category: null } : item
      ),
    }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLocalQuestion(prev => ({
      ...prev,
      categories: [...prev.categories, { id: uuidv4(), name: newCategoryName }]
    }));
    setNewCategoryName('');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setLocalQuestion(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: uuidv4(), text: newItemText, correctCategoryId: newItemCategory || null }
      ]
    }));
    setNewItemText('');
    setNewItemCategory('');
  };

  const handleItemCategoryChange = (itemId, categoryId) => {
    setLocalQuestion(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, correctCategoryId: categoryId } : item
      ),
    }));
  };

  const handleItemDelete = (id) => {
    setLocalQuestion(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = categories.findIndex(cat => cat.id === active.id);
      const newIndex = categories.findIndex(cat => cat.id === over.id);
      setLocalQuestion(prev => ({
        ...prev,
        categories: arrayMove(prev.categories, oldIndex, newIndex)
      }));
    }
  };

  const handleTitleChange = e => {
    setLocalQuestion(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  return (
    <div
      style={{
        maxWidth: 540,
        margin: "2rem auto",
        padding: "32px 16px",
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 4px 32px rgba(30,41,59,0.07)",
        fontFamily: 'Inter, Arial, sans-serif',
        marginBottom: 36,
        position: "relative"
      }}>
      <button
        onClick={onDelete}
        style={{
          position: "absolute", top: 16, right: 18,
          background: "none", border: "none", cursor: "pointer"
        }}
        title="Delete Question"
      >
        <RxCross2 className="text-red-500 text-2xl" />
      </button>
      <input
        value={localQuestion.title}
        onChange={handleTitleChange}
        placeholder="Question Title (e.g. Sort the animals)"
        className="border p-2 rounded w-full font-semibold mb-4"
        style={{
          fontSize: 19,
          marginBottom: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 8
        }}
      />

      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>
        Categories
      </h2>
      <form onSubmit={handleAddCategory} style={{
        display: 'flex', gap: 8, marginBottom: 20
      }}>
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Create category"
          className="border p-2 rounded flex-grow"
          style={{
            border: "1px solid #e5e7eb",
            padding: "0.55em 1em",
            fontSize: 16,
            borderRadius: 8
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 rounded"
          style={{
            background: '#475569',
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 8,
            padding: "0 18px"
          }}
        >
          Add
        </button>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {categories.length ? categories.map(cat => (
            <div
              key={cat.id}
              style={{
                padding: "5px 5px 5px 5px",
                marginBottom: 10,
                background: "#f6f7f9",
                border: "1px solid #e5e7eb",
                borderRadius: 9,
                boxShadow: "0 1px 6px #0001",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "box-shadow .2s, background .2s"
              }}>
              <SortableCategory
                id={cat.id}
                name={cat.name}
                onDelete={handleCategoryDelete}
              />
            </div>
          )) : (
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 12 }}>
              No categories
            </div>
          )}
        </SortableContext>
      </DndContext>

      <h2 style={{
        fontWeight: 600,
        fontSize: 22,
        marginTop: 36,
        marginBottom: 16,
        borderTop: "1px solid #e5e7eb",
        paddingTop: 30
      }}>
        Items
      </h2>
      <form onSubmit={handleAddItem} style={{
        display: 'flex', gap: 8, marginBottom: 18
      }}>
        <input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add item"
          className="border p-2 rounded flex-grow"
          style={{
            border: "1px solid #e5e7eb",
            padding: "0.55em 1em",
            fontSize: 16,
            borderRadius: 8
          }}
        />
        <select
          value={newItemCategory}
          onChange={e => setNewItemCategory(e.target.value)}
          className="border p-2 rounded"
          style={{
            minWidth: 140,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 16
          }}
        >
          <option value="">No category</option>
          {categories.map(cat => (
            <option value={cat.id} key={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-2 rounded"
          style={{
            background: '#059669',
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 8,
            padding: "0 14px"
          }}
        >
          Add
        </button>
      </form>

      <div style={{marginTop: 8}}>
        {items.length ? items.map(item => (
          <div key={item.id} style={{
            border: "1px solid #e5e7eb",
            padding: "10px",
            marginBottom: 11,
            borderRadius: 9,
            background: "#fcfdfe",
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 1px 4px #0001',
            transition: "box-shadow .18s"
          }}>
            <span style={{ flex: 1, fontSize: 16 }}>{item.text}</span>
            <select
              value={item.correctCategoryId || ''}
              onChange={e => handleItemCategoryChange(item.id, e.target.value)}
              className="border p-1 rounded"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 15,
                padding: '0 8px',
                minWidth: 120
              }}
            >
              <option value="">No category</option>
              {categories.map(cat => (
                <option value={cat.id} key={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button onClick={() => handleItemDelete(item.id)} style={{
              marginLeft: 6,
              background: "none",
              border: "none",
              cursor: "pointer"
            }}>
              <RxCross2 className='text-red-500 text-xl' />
            </button>
          </div>
        )) : (
          <div style={{
            color: '#6b7280',
            fontSize: 15,
            textAlign: 'center',
            marginTop: 14
          }}>
            No items yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
