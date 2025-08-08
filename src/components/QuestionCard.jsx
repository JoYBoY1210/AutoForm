import React from 'react'
import Cloze from './Cloze'
import Comprehension from './Comprehension'
import Categories from './Categories'

function QuestionCard({type, id, onRemove}) {
  return (
    <div >
        {type==='categorize'&&<Categories onDelete={() => onRemove(id)} />}
        {type==='cloze'&&<Cloze onDelete={() => onRemove(id)} />}
        {type==='comprehension'&&<Comprehension onDelete={() => onRemove(id)} />}
    </div>
  )
}

export default QuestionCard
