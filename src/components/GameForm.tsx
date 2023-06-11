import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Game } from "../Models";
import { useLoaderData, useNavigate, useSubmit } from "react-router-dom";

function GameForm() {
  const gameList = useLoaderData() as Game[]
  function handleChange(event: any) {
    const value = event.target.value as string;
    const name = event.target.name as "name" | "short" | "email";
    setFormData({ ...formData, [name]: value });
    if (gameList.some(({ name }) => name === value)) {
      setErr(`Game "${name}" already exists.`);
    } else {
      setErr("")
    }
  }
  const submit = useSubmit()

  const doSubmit = (e: any) => {
    e.preventDefault();
    submit(formData, { method: "put" })
  };

  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({
    name: "",
  });
  const navigate = useNavigate()
  return (
    <div>
      <Dialog.Title className="pl-2 font-bold text-lg">Add Game</Dialog.Title>
      <Dialog.Description className="break-normal py-1">
        Add a new game
      </Dialog.Description>
      <form
        onSubmit={doSubmit}
        className="grid grid-cols-1 justify-items-center outline-offset-1"
        autoComplete="off"
      >
        <label className="my-1">
          <span className="block">Name:</span>
          <input
            name="name" type="text"
            placeholder="Wonder Boy"
            value={formData.name}
            onChange={handleChange}
            required={true}
            className="p-1 outline outline-1 outline-stone-400 rounded-md valid:outline-green-500"
          /> </label>
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
            disabled={err.length > 0}
            className="mx-3 px-2 py-1 bg-violet-700 disabled:bg-slate-600 rounded-lg"
          >
            Add New Game
          </button>
        </div>
        <div className={"text-red-600 " + (!!err ? "" : "display-none")}>{err}</div>
      </form>
    </div>
  );
}

export default GameForm;
