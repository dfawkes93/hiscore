import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import ScoreTable from "./ScoreTable";
import logo from "./logo.svg";
import "./App.css";
import { User, Score, Game, DataTypes } from "./Models";
import { getUsers, getGames, addUser, addGame, addScore } from "./database";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({ game: "", name: "" });
  const [modalType, setModalType] = useState(DataTypes.Score);
  const [games, setGames] = useState([{ ID: 0, name: "" }]);
  const [users, setUsers] = useState([
    { ID: 0, name: "", short: "", email: "" },
  ]);
  const handleModal = (show: boolean, type?: DataTypes, content?: any) => {
    setOpenModal(show);
    if (type !== undefined) {
      setModalType(type);
    }
    if (content !== undefined) {
      setModalContent(content);
    }
  };

  const submitHandler = (
    type: DataTypes,
    value: User | Score | Game
  ): Promise<string> => {
    switch (type) {
      case DataTypes.User:
        const user = value as User;
        if (
          users.some((e) => {
            return e.name === user.name;
          })
        ) {
          return Promise.reject(`User "${user.name}" already exists.`);
        }
        if (
          users.some((e) => {
            return e.short === user.short;
          })
        ) {
          return Promise.reject(`Arcade name "${user.short}" already taken.`);
        }
        addUser(user)
          .then(() => {
            return getUsers();
          })
          .then((response) => {
            response && setUsers(response);
          })
          .catch((e) => {
            console.error("Error adding user. " + e.message);
          });
        return Promise.resolve(`User ${user.name} added successfully`);
      case DataTypes.Score:
        const score = value as Score;
        score.gameId = games.find((game) => game.name === score.game)?.ID || -2;
        score.playerId =
          users.find((user) => user.name === score.player || user.short === score.player)
            ?.ID || -1;
        if (score.gameId === -1) {
          return Promise.reject("Unknown Game");
        }
        if (score.playerId === -1) {
          return Promise.reject("Unknown Player");
        }
        addScore(score)
          .then(() => {
            return getGames();
          })
          .then((response) => {
            response && setGames(response);
          })
          .catch((e) => {
            console.error("Error adding score. " + e.message);
          });
        return Promise.resolve(`Score added successfully`);
      case DataTypes.Game:
        const game = value as Game;
        if (
          games.some((e) => {
            return e.name === game.name;
          })
        ) {
          return Promise.reject(`Game "${game.name}" already exists.`);
        }
        addGame(game)
          .then(() => {
            return getGames();
          })
          .then((response) => {
            response && setGames(response);
          })
          .catch((e) => {
            console.error("Error adding game. " + e.message);
          });
        return Promise.resolve(`Game ${game.name} added successfully`);
    }
    return Promise.reject("Unhandled case");
  };

  //Load initial game list
  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res);
    });
    getGames().then((res) => {
      setGames(res);
    });
  }, []);

  return (
    <div className="App bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>21CS High Scores</h1>
        <div id="actions" className="ml-auto text-lg">
          <button
            className="mx-3 py-1 px-2 rounded-lg outline outline-1 outline-violet-500"
            onClick={() => {
              handleModal(true, DataTypes.User);
            }}
          >
            Add User
          </button>
          <button
            className="mx-3 py-1 px-2 rounded-lg outline outline-1 outline-violet-500"
            onClick={() => {
              handleModal(true, DataTypes.Game);
            }}
          >
            Add Game
          </button>
        </div>
      </header>
      <div className="container mx-auto px-4">
        <div className="grid grid-flow-row grid-cols-2 gap-4 justify-evenly justify-items-center">
          {games.map((e) => {
            return <ScoreTable key={e.name} handleModal={handleModal} game={e} />;
          })}
        </div>
      </div>
      <Modal
        open={openModal}
        setOpen={handleModal}
        modalType={modalType}
        modalContent={modalContent}
        submitHandler={submitHandler}
      />
    </div>
  );
}

export default App;
