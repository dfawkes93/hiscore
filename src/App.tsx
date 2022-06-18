import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import ScoreTable from "./ScoreTable";
import logo from "./logo.svg";
import "./App.css";
import * as baseData from "../res/data.json";
import { User, Score, Game, DataTypes } from "./Models";
import { getUsers, getGames, addUser } from "./database";

function App() {
  if (!localStorage.getItem("data")) {
    localStorage.setItem("data", JSON.stringify(baseData));
  }
  const dato = JSON.parse(localStorage.getItem("data") ?? "{}");
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(DataTypes.Score);
  const [games, setGames] = useState([{ ID: 0, name: "" }]);
  const [users, setUsers] = useState([
    { ID: 0, name: "", short: "", email: "" },
  ]);
  const handleModal = (show: boolean, content?: DataTypes) => {
    setOpenModal(show);
    if (content) {
      setModalContent(content);
    }
  };
  const submitHandler = (
    type: DataTypes,
    value: User | Score | Game
  ) => {
    switch (type) {
      case DataTypes.User:
        addUser((value as User))
          .then(() => {
            return getUsers()
          })
          .then((response) => {
            response && setUsers(response)
          })
          .catch( (e) => {
            console.error("Error adding user. "+e.message)
          });
          break;
      case DataTypes.Score:
      break;
      case DataTypes.Game:
      break;
    }
  }

  const loadonce = useEffect(() => {
    getGames().then((res) => {
      setGames(res);
    });
  }, []);

  return (
    <div className="App bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>21CS High Scores</h1>
      </header>
      <div className="container mx-auto px-4">
        <div className="grid grid-flow-row grid-cols-2 gap-4 justify-evenly justify-items-center">
          {games.map((e) => {
            return <ScoreTable showModal={handleModal} game={e} />;
          })}
        </div>
      </div>
      <button
        onClick={() => {
          handleModal(true, DataTypes.User);
        }}
      >
        Add User
      </button>
      <Modal
        open={openModal}
        setOpen={handleModal}
        modalContent={modalContent}
        submitHandler={submitHandler}
      />
    </div>
  );
}

export default App;
