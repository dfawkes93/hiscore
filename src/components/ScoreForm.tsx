import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { DataTypes, User } from "../Models";
import { UserCombo } from "./UserCombo";

function ScoreForm({
  handleSubmit,
  setOpen,
  data,
}: {
  handleSubmit: any;
  setOpen: any;
  data?: any;
}) {
  const handleChange = (event: any) => {
    const value = event.target.value as string;
    const name = event.target.name as "player" | "game" | "score";
    setFormData({ ...formData, [name]: value });
  }

  const handleCombo = (thisuser: User) => {
      console.log(thisuser)
      setFormData({...formData, player: thisuser.name});
      setSelectedPerson(thisuser);
  }

  const doSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit(DataTypes.Score, formData)
      .then(
        () => setOpen(false),
        (e: string) => setErr(e)
      )
      .catch((e: string) => {
        setErr(e);
      });
  };
  const [err, setErr] = useState("");
  const [selectedPerson, setSelectedPerson] = useState({ID: 0, name: "", short: ""});
  const [formData, setFormData] = useState({
    player: "",
    game: data?.game || "",
    score: data?.score || "",
  });

  useEffect(() => {
    if (data?.game !== undefined) {
      setFormData({ ...formData, game: data.game });
    }
    if (data?.player !== undefined) {
      setFormData({ ...formData, player: data.player });
    }
  }, [data]);
  return (
    <div>
      <Dialog.Title className="pl-2 font-bold text-lg">Add Score</Dialog.Title>
      <form
        onSubmit={doSubmit}
        className="grid grid-cols-1 justify-items-center outline-offset-1"
      >
        <label className="my-1">
          <span className="block">Player:</span>
          <UserCombo users={data?.users} value={selectedPerson} handleChange={handleCombo}/>
        </label>
        <label className="my-1">
          <span className="block">Game:</span>
          <input
            name="game"
            type="text"
            value={formData.game}
            onChange={handleChange}
            required={true}
            className="p-1 outline outline-1 outline-stone-400 rounded-md invalid:outline-red-400 valid:outline-green-500"
          />
        </label>
        <label className="my-1">
          <span className="block">Score:</span>
          <input
            name="score"
            type="text"
            value={formData.score}
            pattern={"[0-9]+"}
            required={true}
            onChange={handleChange}
            className="p-1 outline outline-1 outline-stone-400 rounded-md"
          />
        </label>
        <div
          id="buttonBar"
          className="inline pt-2 dark:text-stone-100 font-bold"
        >
          <button
            className="mx-3 px-2 py-1 bg-violet-700 rounded-lg"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
          <button
            type="submit"
            className="mx-3 px-2 py-1 bg-violet-700 rounded-lg"
          >
            Add New Score
          </button>
        </div>
        <div className={"text-red-600 " + (!!err ? "" : "display-none")}>
          {err}
        </div>
      </form>
    </div>
  );
}

export default ScoreForm;
