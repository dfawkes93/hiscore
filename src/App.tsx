import { useState } from 'react'
import Modal from './components/Modal'
import ScoreTable from './ScoreTable'
import logo from './logo.svg'
import './App.css'
import * as baseData from "../res/data.json"

function App() {
  if (!localStorage.getItem('data')) {
	localStorage.setItem('data', JSON.stringify(baseData));
  }
  const data = JSON.parse(localStorage.getItem('data') ?? '{}'); 
  const [count, setCount] = useState(0)
  //const data = JSON.parse(rawdata);
  const newScore = () => {
	console.log("New score!")
	data.scorelist[0].scores.push({
		"player": "someguy",
		"score": Math.floor(Math.random()*10000).toString(),
		"date": "07/06/2022"
	})
	localStorage.setItem('data', JSON.stringify(data));
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
		<h1>21CS High Scores</h1>
      </header>
		<div className="grid grid-cols-3 gap-8">
		{ScoreTable(data.scorelist[1])}
		{ScoreTable(data.scorelist[0])}
		</div>
        <p>
		  <button 
			className="bg-violet-700"
			onClick={newScore}>
			Post new score
		  </button>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
    </div>
  )
}

export default App
