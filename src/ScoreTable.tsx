function ScoreTable(gameData: any) {
const bodyData: any[] = [];
for (const score of gameData.scores) {
	bodyData.push(
		<tr key = {gameData.scores.indexOf(score)}>
			<td className="px-2 text-left"> {score.player} </td>
			<td className="px-2 text-right"> {score.score} </td>
			<td className="px-2 text-right"> {score.date} </td>
		</tr>);
}
return (
<div>
<h1 className="text-left uppercase">{gameData.game}</h1>
<table className="border-collapse">
  <thead>
    <tr>
      <th className="bg-slate-400">Player</th>
      <th className="bg-slate-400">Score</th>
      <th className="bg-slate-400">Date</th>
    </tr>
  </thead>
  <tbody>{bodyData}</tbody>
</table>
</div>
)}

export default ScoreTable
