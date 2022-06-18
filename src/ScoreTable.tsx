import { Game, User, Score } from "./Models";
import { getGameScores } from "./database";
import { useEffect, useState } from "react";

function ScoreTable({ showModal, game }: { showModal: any; game: Game }) {
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

  return (
    <div>
      <h1 className="text-left uppercase">{game.name}</h1>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="bg-slate-600">Player</th>
            <th className="bg-slate-600">Score</th>
            <th className="bg-slate-600">Date</th>
          </tr>
        </thead>
        <tbody>
        {scores.map(score => {
          return (<tr key={scores.indexOf(score)}>
            <td className="px-2 text-left"> {score.short} </td>
            <td className="px-2 text-right"> {score.score} </td>
            <td className="px-2 text-right"> {score.date} </td>
          </tr>  )})}
          </tbody>
      </table>
      <button
        className="bg-violet-700 px-2 font-bold mt-2 rounded-lg"
        onClick={() => {
          showModal(true);
        }}
      >
        Post new score
      </button>
    </div>
  );
}

export default ScoreTable;
