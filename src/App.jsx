import Formbuilder from './components/Formbuilder'
import TestCategorise from './components/TestCategorise'
import TextCloze from './components/TextCloze'
import TestComprehension from './components/TestComprehension'
import UserTestView from './components/UserTestView'
import './App.css'
import { useState,useEffect } from 'react'

function App() {
  const[testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/tests/6898ebb45547bdba49c18d17")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.questions);
        setTestData(data?.questions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching test data:", err);
        alert("Failed to load test data.");
        setLoading(true);
      });
  }, []);


  // console.log(testData);
  // if(loading){
  //   return <div>Loading...</div>;
  // }

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


