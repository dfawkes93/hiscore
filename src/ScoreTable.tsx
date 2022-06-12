function ScoreTable(
    {showModal, updateData, gameData}: {
     showModal: boolean; updateData: any; scores: any
     }) {
  const bodyData: any[] = [];
  const newScore = () => {
    console.log("New score!");
    gameData.scores.push({
      player: "someguy",
      score: Math.floor(Math.random() * 10000).toString(),
      date: "07/06/2022",
    });
  };

  for (const score of gameData.scores) {
    bodyData.push(
      <tr key={gameData.scores.indexOf(score)}>
        <td className="px-2 text-left"> {score.player} </td>
        <td className="px-2 text-right"> {score.score} </td>
        <td className="px-2 text-right"> {score.date} </td>
      </tr>
    );
  }
  return (
    <div>
      <h1 className="text-left uppercase">{gameData.game}</h1>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="bg-slate-600">Player</th>
            <th className="bg-slate-600">Score</th>
            <th className="bg-slate-600">Date</th>
          </tr>
        </thead>
        <tbody>{bodyData}</tbody>
      </table>
      <button className="bg-violet-700 px-2 font-bold mt-2 rounded-lg" onClick={() => {showModal(true)}}>
        Post new score
      </button>
    </div>
  );
}

export default ScoreTable;
