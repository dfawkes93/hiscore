import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import ScoreTable from "./ScoreTable";
import "./App.css";
import { User, Score, Game, DataTypes } from "./Models";
import { getUsers, getGames, addUser, addGame, addScore } from "./database";
import Header from "./components/Header";
import { getSortFunction, SortFuncs } from "./utils/sorting";

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
          users.find(
            (user) => user.name === score.player || user.short === score.player
          )?.ID || -1;
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
    <div className="App bg-gray-800 text-slate-300">
      <Header searchString={searchString} setSearchString={setSearchString} sortFunc={sortFunc} setSortFunc={setSortFunc} handleModal={handleModal}/>
      <div className="container mx-auto">
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-evenly justify-items-center">
          {games
            .filter((game) => {
              return game.name
                .toLowerCase()
                .includes(searchString.toLowerCase());
            })
            .sort(getSortFunction(sortFunc))
            .map((e) => {
              return (
                <ScoreTable key={e.name} handleModal={handleModal} game={e} />
              );
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
