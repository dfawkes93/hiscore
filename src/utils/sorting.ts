import { Game } from "../Models";

export  enum SortFuncs {
    "Popular",
    "Newest",
    "Alpha",
  }

  export const cycleSortFunction = (func: number) => {
    if (func > Object.keys(SortFuncs).length / 2 - 1) {
      func = 0;
    } else if ( func < 0 ) {
      func = Object.keys(SortFuncs).length / 2;
    }
    //setSortFunc(func);
    return func
  };

export  function getSortFunction(type: SortFuncs) {
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


