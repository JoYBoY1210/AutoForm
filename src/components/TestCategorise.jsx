import React from 'react'
import CategorizeUserView from './CategorizeUserView';

function TestCategorise() {

  const sampleCategories = [
    { id: "cat-1", name: "Fruits" },
    { id: "cat-2", name: "Animals" },
    { id: "cat-3", name: "Vehicles" },
  ];

  const sampleItems = [
    { id: "item-1", text: "Apple", categoryId: null },
    { id: "item-2", text: "Dog", categoryId: null },
    { id: "item-3", text: "Car", categoryId: null },
    { id: "item-4", text: "Banana", categoryId: null },
  ];
  return (
    <div>
      <CategorizeUserView
        categories={sampleCategories}
        items={sampleItems}
      />
    </div>
  )
}

export default TestCategorise
