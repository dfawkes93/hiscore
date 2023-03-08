  import {
  DocumentAddIcon,
  PaperAirplaneIcon,
  UserAddIcon,
  UserGroupIcon,
  SparklesIcon,
  SearchIcon,
  SortDescendingIcon,
} from "@heroicons/react/outline";
import { DataTypes } from "../Models";
import { cycleSortFunction, SortFuncs } from "../utils/sorting";

    function Header({ sortFunc, setSortFunc, searchString, setSearchString, handleModal  }: { sortFunc: SortFuncs, setSortFunc : any, searchString: string, setSearchString: any, handleModal: any}) {
      return (
      <header className="App-header">
        <PaperAirplaneIcon className="m-4 p-1 h-10 w-10 text-slate-300 bg-violet-800 rounded-full" />
        <h1 className="hidden md:inline">21CS High Scores</h1>
        <h1 className="hidden sm:inline md:hidden">Hiscore</h1>
        <button
          className="ml-auto rounded-lg outline outline-1 outline-violet-500 text-base lg:text-lg inline-flex"
          onClick={() => {
            setSortFunc(cycleSortFunction(sortFunc + 1));
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
)}

export default Header;
