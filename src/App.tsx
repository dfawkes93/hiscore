import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import ScoreTable from "./ScoreTable";
import sendNotification from "./sendNotification";
import "./App.css";
import { User, Score, Game, DataTypes } from "./Models";
import { getUsers, getGames, addUser, addGame, addScore } from "./database";
import {
  PaperAirplaneIcon,
  DocumentAddIcon,
  UserAddIcon,
  UserGroupIcon,
  SparklesIcon,
  SearchIcon,
  SortDescendingIcon,
} from "@heroicons/react/outline";

function App() {
  enum SortFuncs {
    "Popular",
    "Newest",
    "Alpha",
  }
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

  const cycleSortFunction = (func: number) => {
    if (func > Object.keys(SortFuncs).length / 2 - 1) {
      func = 0;
    }
    setSortFunc(func);
  };

  function getSortFunction(type: SortFuncs) {
    if (type === SortFuncs.Popular) {
      return (a: Game, b: Game) => b.players - a.players;
    }

    if (type === SortFuncs.Newest) {
      return (a: Game, b: Game) => {
        if (!a.lastUpdated) {
            return 1;
        }
        if (!b.lastUpdated) {
            return -1;
        }
        return b.lastUpdated > a.lastUpdated ? 1 : -1;
      };
    }

    if (type === SortFuncs.Alpha) {
      return (a: Game, b: Game) => a.name > b.name ? 1 : -1;
    }

    return (a: Game, b: Game) => 0;
  }

  const submitHandler = (
    type: DataTypes,
    value: User | Score | Game
  ): Promise<string> => new Promise((res, rej) => {
    switch (type) {
      case DataTypes.User:
        const user = value as User;
        if (users.some(({name}) => name === user.name)) {
          return rej(`User "${user.name}" already exists.`);
        }
        if (users.some(({short}) => short === user.short)) {
          return rej(`Arcade name "${user.short}" already taken.`);
        }
        addUser(user)
          .then(getUsers)
          .then(response => setUsers(response))
          // NOTE: Modal doesn't wait for success
          //.then(()=> res(`User ${user.name} added successfully`))
          .catch((e) => {
            const msg = "Error adding user. " + e.message;
            console.error(msg);
            rej(msg);
          });
        return res(`User ${user.name} added successfully`);

      case DataTypes.Score: {
        const score = value as Score;
        const game = games.find(({name}) => name === score.game);
        const player = users.find(
          ({name, short}) => name === score.player || short === score.player
        );

        score.gameId = game?.ID || -2;
        if (score.gameId === -2) {
          return rej("Unknown Game");
        }
        score.playerId = player?.ID || -1;
        if (score.playerId === -1) {
          return rej("Unknown Player");
        }
        alert("Addding");
        addScore(score)
          .then(getGames)
          .then((response) => response && setGames(response))
          .then(() => {
            alert("sendNotification");
            sendNotification(player?.short || "", game?.name || "", score.score);
          })
          .catch((e) => {
            console.error("Error adding score. " + e.message);
            rej("Error adding score. " + e.message);
          });
        return res("Score added successfully");
      }

      case DataTypes.Game: {
        const game = value as Game;
        if (games.some(({name}) => name === game.name)) {
          return rej(`Game "${game.name}" already exists.`);
        }
        addGame(game)
          .then(getGames)
          .then((response) => response && setGames(response))
          .catch((e) => {
            console.error("Error adding game. " + e.message);
            rej("Error adding game. " + e.message);
          });
        return res(`Game ${game.name} added successfully`);
      }
    }

  });

  //Load initial game list
  useEffect(() => {
    getUsers().then(setUsers);
    getGames().then(setGames);
  }, []);

  return (
    <div className="App bg-gray-800 text-slate-300">
      <header className="App-header">
        <PaperAirplaneIcon className="m-4 p-1 h-10 w-10 text-slate-300 bg-violet-800 rounded-full" />
        <h1 className="hidden md:inline">21CS High Scores</h1>
        <h1 className="hidden sm:inline md:hidden">Hiscore</h1>
        <button
          className="ml-auto rounded-lg outline outline-1 outline-violet-500 text-base lg:text-lg inline-flex"
          onClick={() => {
            cycleSortFunction(sortFunc + 1);
          }}
          title={SortFuncs[sortFunc]}
        >
          <div className="hidden sm:inline text-lg ml-auto pl-2 py-2">
            Sorting:
          </div>
          <UserGroupIcon
            className={
              "w-6 m-2 inline" +
              (sortFunc === SortFuncs.Popular ? "" : " hidden")
            }
          />
          <SparklesIcon
            className={
              "w-6 m-2 inline" +
              (sortFunc === SortFuncs.Newest ? "" : " hidden")
            }
          />
          <SortDescendingIcon
            className={
              "w-6 m-2 inline" + (sortFunc === SortFuncs.Alpha ? "" : " hidden")
            }
          />
        </button>
        <div
          id="search"
          className="bg-gray-600 text-gray-300 text-base rounded-md p-1 ml-auto inline-flex focus-within:absolute focus-within:min-w-full focus-within:rounded-none focus-within:min-h-[3rem] sm:focus-within:static sm:focus-within:min-w-[6rem] sm:focus-within:rounded-md sm:focus-within:min-h-0"
        >
          <SearchIcon className="h-4 w-4 sm:h-8 sm:w-8 my-auto" />
          <input
            type="text"
            className="ml-2 bg-transparent focus-visible:outline-none max-w-[4rem] md:max-w-sm focus:max-w-none"
            placeholder="Search"
            value={searchString}
            onChange={(e: any) => {
              setSearchString(e.target.value);
            }}
          ></input>
        </div>
        <div id="actions" className="mr-0 text-sm lg:text-md">
          <button
            className="mx-3 p-1 rounded-lg outline outline-1 outline-violet-500"
            onClick={() => {
              handleModal(true, DataTypes.User);
            }}
            title="Add User"
          >
            <UserAddIcon className="h-8 w-8" />
          </button>
          <button
            className="mx-3 p-1 rounded-lg outline outline-1 outline-violet-500"
            onClick={() => {
              handleModal(true, DataTypes.Game);
            }}
            title="Add Game"
          >
            <DocumentAddIcon className="h-8 w-8" />
          </button>
        </div>
      </header>
      <div className="container mx-auto">
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-evenly justify-items-center">
          {games
            .filter((game) => game.name
                .toLowerCase()
                .includes(searchString.toLowerCase()))
            .sort(getSortFunction(sortFunc))
            .map((e) => <ScoreTable key={e.name} handleModal={handleModal} game={e} />)
          }
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
