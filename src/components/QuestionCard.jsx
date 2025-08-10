import React from 'react'
import Cloze from './Cloze'
import Comprehension from './Comprehension'
import Categories from './Categories'

function QuestionCard({question, onChange, onRemove}) {
  return (
     <div>
      {question.type === 'categorize' && (
        <Categories
          onChange={onChange}
          onDelete={() => onRemove(question.id)}
          question={question}
        />
      )}
      {question.type === 'cloze' && (
        <Cloze
          onChange={onChange}
          onDelete={() => onRemove(question.id)}
          question={question}
        />
      )}
      {question.type === 'comprehension' && (
        <Comprehension
          onChange={onChange}
          onDelete={() => onRemove(question.id)}
          question={question}
        />
      )}
    </div>
  )
}

export default QuestionCard
