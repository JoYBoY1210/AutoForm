import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

function Container({ id, title, color, itemIds, allItems, itemStyle }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const containerStyle = {
    ...boxStyle(color),
    border: isOver ? "2px dashed #4f46e5" : "none",
    transform: isOver ? "scale(1.02)" : "scale(1)",
  };

  return (
    <div ref={setNodeRef} style={containerStyle}>
      <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.7rem" }}>
        {title}
      </h2>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {itemIds.length === 0 ? (
          <div style={emptyStyle}>No items</div>
        ) : (
          itemIds.map((itemId) => {
            const item = allItems.find((i) => i.id === itemId);
            return (
              <SortableItem
                key={item.id}
                id={item.id}
                text={item.text}
                className={itemStyle}
              />
            );
          })
        )}
      </SortableContext>
    </div>
  );
}

function DragPreview({ item, itemStyle }) {
  return (
    <div
      style={{
        ...itemStyle,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        transform: "scale(1.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {item.text}
      </div>
    </div>
  );
}

function CategorizeUserView({ data, onChange }) {
  const { categories, items } = data;

  const [categoryItems, setCategoryItems] = useState(() => {
    const initial = { unassigned: items.map((i) => i.id) };
    categories.forEach((cat) => {
      initial[cat.id] = [];
    });
    return initial;
  });

  const [activeId, setActiveId] = useState(null);
  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id) => {
    if (id in categoryItems) return id;
    return Object.keys(categoryItems).find((key) =>
      categoryItems[key].includes(id)
    );
  };

  const updateState = (newState) => {
    setCategoryItems(newState);
    if (onChange) {
      const result = {};
      categories.forEach((cat) => {
        result[cat.id] = newState[cat.id].map((id) =>
          items.find((i) => i.id === id)
        );
      });
      onChange(result);
    }
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const activeIndex = categoryItems[activeContainer].indexOf(active.id);
      const overIndex = categoryItems[overContainer].indexOf(over.id);
      updateState({
        ...categoryItems,
        [activeContainer]: arrayMove(
          categoryItems[activeContainer],
          activeIndex,
          overIndex
        ),
      });
    } else {
      const activeItems = [...categoryItems[activeContainer]];
      activeItems.splice(activeItems.indexOf(active.id), 1);

      const overItems = [...categoryItems[overContainer]];
      const overIndex = overItems.indexOf(over.id);
      const insertIndex = overIndex >= 0 ? overIndex : overItems.length;
      overItems.splice(insertIndex, 0, active.id);

      updateState({
        ...categoryItems,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      });
    }
  };

  const handleDragCancel = () => setActiveId(null);

  const colors = ["#ffe5e5", "#e5f1ff", "#e8ffe5", "#fff9e5"];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: "1rem 1.5rem",
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <Container
            id="unassigned"
            title="Unassigned"
            color="#f8f9fa"
            itemIds={categoryItems.unassigned}
            allItems={items}
            itemStyle="p-2 mb-2 bg-white rounded shadow-sm cursor-move hover:bg-gray-100 transition-colors"
          />

          {categories.map((cat, index) => (
            <Container
              key={cat.id}
              id={cat.id}
              title={cat.name}
              color={colors[index % colors.length]}
              itemIds={categoryItems[cat.id]}
              allItems={items}
              itemStyle="p-2 mb-2 bg-white rounded shadow-sm cursor-move hover:bg-gray-100 transition-colors"
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={{
            ...defaultDropAnimation,
            duration: 300,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeItem ? (
            <DragPreview
              item={activeItem}
              itemStyle={{
                padding: "0.5rem 1rem",
                background: "white",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                cursor: "grabbing",
                width: "200px",
              }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

const boxStyle = (color) => ({
  background: color,
  borderRadius: "8px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  padding: "1.2rem",
  minHeight: 160,
  transition: "all 0.2s ease",
});

const emptyStyle = {
  color: "#6c757d",
  fontSize: 14,
  fontStyle: "italic",
  margin: "4px 0",
};

export default CategorizeUserView;
