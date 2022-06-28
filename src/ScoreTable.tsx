import { Game, User, Score, DataTypes } from "./Models";
import { getGameScores } from "./database";
import { useEffect, useState } from "react";

function ScoreTable({ handleModal, game }: { handleModal: any; game: Game }) {
  const defaultScore: Score = {
    player: "",
    short: "",
    game: game.name,
    score: 0,
    date: "",
  };
  const [scores, setScores] = useState([defaultScore]);
  useEffect(() => {
    getGameScores(game).then((res) => {
      setScores(res);
    });
  }, [game]);

  const postNewScore = () => {
    handleModal(true, DataTypes.Score, { game: game.name });
  };

  return (
    <div className="my-4 min-w-[360px]">
      <div id="table-topbar" className="grid grid-cols-2 mb-1 p-1 align-items-center">
        <h1 className="text-left text-lg uppercase font-bold text-indigo-500">
          {game.name}
        </h1>
        <button
          className="bg-violet-700 mr-0 ml-auto px-2 font-bold rounded-lg"
          onClick={postNewScore}
        >
          Post new score
        </button>
      </div>
      <table className="table-auto border-collapse min-w-full">
        <thead>
          <tr>
            <th className="bg-slate-600">Player</th>
            <th className="bg-slate-600">Score</th>
            <th className="bg-slate-600">Date</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-100 text-indigo-900">
          {scores.slice(0,5).map((score) => {
            return (
              <tr key={scores.indexOf(score)} className="border-b">
                <td className="px-2 text-left py-1">
                  <div className="font-bold">
                    {score.short}
                  </div>
                  <div className="text-xs italic text-gray-400">
                  {score.player}
                  </div>
                </td>
                <td className="px-2 text-right"> {score.score} </td>
                <td className="px-2 text-right">
                  {" "}
                  {score.date.split(" ")[0]}{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreTable;
