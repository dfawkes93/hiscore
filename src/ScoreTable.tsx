import { Game, Score, DataTypes } from "./Models";
import { getGameScores } from "./database";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function ScoreTable({
  game,
  limit,
}: {
  game: Game;
  limit?: number;
}) {
  const [scores, setScores] = useState<Score[]>([]);

  const ref = useRef<HTMLTableElement>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting && 
        loadScores()
      },
      {
        rootMargin: "0px"
      }
    );
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, [game]);

  const loadScores = () => 
        getGameScores(game)
          .then((res) => res.json())
          .then((res) => {
            setScores(res);
          });

  const formatTime = (datetime: string) => {
    if (!datetime) return "-";
    const date = new Date(datetime.replace(/ /g, "T") + "+00:00");
    return date.toLocaleTimeString("en-GB", { timeStyle: "short" });
  };
  const formatDate = (datetime: string) => {
    if (!datetime) return "-";
    const date = new Date(datetime.replace(/ /g, "T") + "+00:00");
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const [params] = useSearchParams()
  const navigate = useNavigate()

  return (
    <div className="my-4 min-w-[360px]">
      <div
        id="table-topbar"
        className="grid grid-cols-2 mb-1 p-1 align-items-center"
      >
        <h1 className="text-left text-lg uppercase font-bold text-indigo-500 truncate" title={game.name}>
          <Link to={`/games/${game.name}`}>{game.name}</Link>
        </h1>
        <button
          className="bg-violet-700 mr-0 ml-auto px-2 font-bold rounded-lg"
          onClick={() => navigate({ pathname: "new/score", search: params.toString() }, { state: { modal: { type: DataTypes.Score, game: game } } })}
        >
          New score
          <PlusIcon className="ml-2 h-4 w-4 inline" />
        </button>
      </div>
      <table className="table-auto border-collapse min-w-full" ref={ref}>
        <thead>
          <tr>
            <th className="bg-slate-600">Player</th>
            <th className="bg-slate-600">Score</th>
            <th className="bg-slate-600">Date</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-100 text-indigo-900">
          {scores ?
            scores.slice(0, limit).map((score) => {
              return (
                <tr key={scores.indexOf(score)} className="border-b">
                  <td className="px-2 text-left py-1">
                    <div className="font-bold">{score.short}</div>
                    <div className="text-xs italic text-gray-400">
                      {score.player}
                    </div>
                  </td>
                  <td className="px-2 text-right"> {score.score} </td>
                  <td className="px-2 text-right">
                    <div className="text-sm">{formatDate(score.date)}</div>
                    <div className="text-xs text-gray-500">
                      {formatTime(score.date)}
                    </div>
                  </td>
                </tr>
              );
            }) :
            new Array(5).fill(
              <tr className="border-b">
                <td className="px-2 text-left py-1 h-12">
                </td>
                <td className="px-2 py-1">
                </td>
                <td className="px-2 py-1">
                </td>
              </tr>)
          }
        </tbody>
      </table>
    </div>
  );
}

export default ScoreTable;
