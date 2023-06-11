import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import "./App.css";
import { User, Score, Game, DataTypes } from "./Models";
import { getUsers, getGames, addUser, addGame, addScore } from "./database";
import Header from "./components/Header";
import { getSortFunction, SortFuncs } from "./utils/sorting";
import { Outlet } from "react-router-dom";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [modalContent, setModalContent] = useState({ game: "", name: "" });
  const [modalType, setModalType] = useState(DataTypes.Score);
  const [sortFunc, setSortFunc] = useState(SortFuncs.Newest);
  const [games, setGames] = useState([
    { ID: 0, name: "", scores: 0, players: 0, lastUpdated: "" },
  ]);
  const [users, setUsers] = useState([{ ID: 0, name: "", short: "" }]);
  const handleModal = (show: boolean, type?: DataTypes, content?: any) => {
    setOpenModal(show);
    if (type !== undefined) {
      setModalType(type);
    }
    if (content !== undefined) {
      if (type === DataTypes.Score) {
        setModalContent({ ...content, users: users });
      } else {
        setModalContent(content);
      }
    }
  };

  const submitHandler = (
    type: DataTypes,
    value: User | Score | Game
  ): Promise<string> =>
    new Promise((res, rej) => {
      switch (type) {
        case DataTypes.User:
          const user = value as User;
          if (users.some(({ name }) => name === user.name)) {
            return rej(`User "${user.name}" already exists.`);
          }
          if (users.some(({ short }) => short === user.short)) {
            return rej(`Arcade name "${user.short}" already taken.`);
          }
          addUser(user)
            .then(getUsers)
            .then((response) => setUsers(response))
            .catch((e) => {
              const msg = "Error adding user. " + e.message;
              console.error(msg);
              rej(msg);
            });
          return res(`User ${user.name} added successfully`);
        case DataTypes.Score: {
          const score = value as Score;
          const game = games.find(({ name }) => name === score.game);
          const player = users.find(
            ({ name, short }) => name === score.player || short === score.player
          );
          score.gameId = game?.ID || -2;
          if (score.gameId === -1) {
            return rej("Unknown Game");
          }

          score.playerId = player?.ID || -1;
          if (score.playerId === -1) {
            return rej("Unknown Player");
          }
          addScore(score)
            .then(getGames)
            .then((response) => response && setGames(response))
            .catch((e) => {
              const msg = "Error adding score. " + e.message;
              console.error(msg);
              rej(msg);
            });
          return res(`Score added successfully`);
        }
        case DataTypes.Game: {
          const game = value as Game;
          if (games.some(({ name }) => name === game.name)) {
            return rej(`Game "${game.name}" already exists.`);
          }
          addGame(game)
            .then(getGames)
            .then((response) => response && setGames(response))
            .catch((e) => {
              const msg = "Error adding game. " + e.message;
              console.error(msg);
              rej(msg);
            });
          return res(`Game ${game.name} added successfully`);
        }
      }
    });

  //Load initial game list
  // useEffect(() => {
  //   getUsers().then(setUsers);
  //   getGames().then(setGames);
  // }, []);

  return (
    <div className="App bg-gray-800 text-slate-300">
      <Header
        handleModal={handleModal}
      />
      <div className="container mx-auto">
        <Outlet />
      </div>
      {/*<Modal submitHandler={submitHandler}/>*/}
      <div>
        Developed by Dylan Fawkes. Send bug reports and feature requests to the{" "}
        <a
          href="https://github.com/dfawkes93/hiscore/issues"
          className="text-indigo-400"
        >
          Github Repo
        </a>
      </div>
    </div>
  );
}

export default App;
