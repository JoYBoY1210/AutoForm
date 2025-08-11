import Formbuilder from './components/Formbuilder'
import TestCategorise from './components/TestCategorise'
import TextCloze from './components/TextCloze'
import TestComprehension from './components/TestComprehension'
import UserTestView from './components/UserTestView'
import './App.css'
import { useState,useEffect } from 'react'
import HomePage from './components/HomePage'
import TestGivePage from './pages/TestGivePage'
import FormBuilderPage from './pages/FormBuilderPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  



  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<FormBuilderPage />} />
        <Route path="/test" element={<TestGivePage />} />
        
      </Routes>
    </Router>
  )
}

export default App


