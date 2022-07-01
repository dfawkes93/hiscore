import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import ScoreTable from "./ScoreTable";
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
      return (a: Game, b: Game) => {
        return b.players - a.players;
      };
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
      return (a: Game, b: Game) => {
        return a.name > b.name ? 1 : -1;
      };
    }

    return (a: Game, b: Game) => {
      return 0;
    };
  }

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
