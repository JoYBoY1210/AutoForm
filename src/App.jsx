import Formbuilder from './components/Formbuilder'
import TestCategorise from './components/TestCategorise'
import TextCloze from './components/TextCloze'
import TestComprehension from './components/TestComprehension'
import UserTestView from './components/UserTestView'
import './App.css'

function App() {
  const testData = [
  {
    id: "q1",
    type: "categorize",
    title: "Sort the animals into categories",
    categories: [
      { id: "c1", name: "Mammals" },
      { id: "c2", name: "Birds" }
    ],
    items: [
      { id: "i1", text: "Dog", correctCategoryId: "c1" },
      { id: "i2", text: "Cat", correctCategoryId: "c1" },
      { id: "i3", text: "Parrot", correctCategoryId: "c2" }
    ]
  },
  {
    id: "q2",
    type: "cloze",
    text: "JavaScript is a [blank] and React is a [blank]",
    options: [
      { id: "o1", text: "programming language" },
      { id: "o2", text: "library" }
    ],
    correctOptionIds: ["o1", "o2"]
  },
  {
    id: "q3",
    type: "comprehension",
    passageTitle: "The Solar System",
    passageText: "The solar system consists of the Sun and the objects that orbit it...",
    questions: [
      {
        id: "mc1",
        text: "What is the center of the solar system?",
        options: [
          { id: "o1", text: "The Earth" },
          { id: "o2", text: "The Sun" },
          { id: "o3", text: "The Moon" }
        ],
        correctOptionId: "o2"
      },
      {
        id: "mc2",
        text: "How many planets are in the solar system?",
        options: [
          { id: "o1", text: "7" },
          { id: "o2", text: "8" },
          { id: "o3", text: "9" }
        ],
        correctOptionId: "o2"
      }
    ]
  }
];

  return (
    <div className=''>
      <UserTestView testData={testData} />
      {/* <TestComprehension /> */}
      {/* <Formbuilder /> */}
      {/* <TestCategorise /> */}
      {/* <TextCloze /> */}

    </div>
  )
}

export default App


