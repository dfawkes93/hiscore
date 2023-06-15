import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Score, User } from "../Models";
import { UserCombo } from "./UserCombo";
import { FormData } from "../utils/types";
import { useLoaderData, useLocation, useNavigate, useSubmit } from "react-router-dom";

function ScoreForm() {
  const navigate = useNavigate()
  const userListData = useLoaderData() as User[]
  const location = useLocation()
  const submit = useSubmit()

  const [userList, setUserList] = useState<User[]>([])

  useEffect(() => {
    setUserList(userListData)
  }, [userListData])

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    const name = event.target.name as "player" | "game" | "score";
    setFormData({ ...formData, [name]: value });
  }

  const handleCombo = (thisuser: User) => {
    setFormData({ ...formData, player: thisuser.name, playerId: thisuser.ID.toString() });
    setSelectedPerson(thisuser);
  }

  const doSubmit = (e: any) => {
    e.preventDefault();
    submit(formData, {
      method: "put",
    })
  };

  const [err, setErr] = useState("");
  const [selectedPerson, setSelectedPerson] = useState({ ID: 0, name: "", short: "" });
  const [formData, setFormData] = useState<FormData<Score>>({
    player: "",
    game: location.state?.modal?.game?.name || "",
    gameId: location.state?.modal?.game?.ID || "",
    score: ""
  });

  return (
    <div>
      <Dialog.Title className="pl-2 font-bold text-lg">Add Score</Dialog.Title>
      <form
        onSubmit={doSubmit}
        className="grid grid-cols-1 justify-items-center outline-offset-1"
        autoComplete="off"
      >
        <label className="my-1">
          <span className="block">Player:</span>
          <UserCombo users={userList} value={selectedPerson} handleChange={handleCombo} />
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
            pattern={"[0-9-\.]+"}
            required={true}
            onChange={handleChange}
            className="p-1 outline outline-1 outline-stone-400 rounded-md"
          />
        </label>
        <div
          id="buttonBar"
          className="inline pt-2 text-stone-100 font-bold"
        >
          <button
            className="mx-3 px-2 py-1 bg-violet-700 rounded-lg"
            onClick={(e) => {
              e.preventDefault()
              navigate(-1)
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
