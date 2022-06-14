import { useState } from "react";
import Modal from "./components/Modal";
import ScoreTable from "./ScoreTable";
import logo from "./logo.svg";
import "./App.css";
import * as baseData from "../res/data.json";
import { getUsers } from "./database";

function App() {
  if (!localStorage.getItem("data")) {
    localStorage.setItem("data", JSON.stringify(baseData));
  }
  const data = JSON.parse(localStorage.getItem("data") ?? "{}");
  const [openModal, setOpenModal] = useState(false)
  const handleModal = (show: boolean) => {
      setOpenModal(show);
  }
  return (
    <div className="App dark:bg-slate-800 dark:text-slate-300">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>21CS High Scores</h1>
      </header>
      <div className="container mx-auto px-4">
        <div className="grid grid-flow-row grid-cols-2 gap-4 justify-evenly justify-items-center">
          <ScoreTable showModal={handleModal} gameData={data.scorelist[1]}/>
          <ScoreTable showModal={handleModal} gameData={data.scorelist[0]}/>
        </div>
      </div>
      <Modal open={openModal} setOpen={handleModal}/>
    </div>
  );
}

export default App;
