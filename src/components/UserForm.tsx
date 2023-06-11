import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { User } from "../Models";
import { useLoaderData, useNavigate, useSubmit } from "react-router-dom";

function UserForm() {
  const userList = useLoaderData() as User[]

  function handleChange(event: any) {
    const value = event.target.value as string;
    const name = event.target.name as "name" | "short" | "email";
    setFormData({ ...formData, [name]: value });
    switch (name) {
      case "name":
        if (userList.some(({ name }) => name === value)) {
          setErr(`User "${value}" already exists.`);
        } else {
          setErr("")
        }
        break;
      case "short":
        if (userList.some(({ short }) => short === value)) {
          setErr(`Arcade name "${value}" already taken.`);
        } else {
          setErr("")
        }
        break;
    }
  }
  const navigate = useNavigate();
  const submit = useSubmit();
  const doSubmit = (e: any) => {
    e.preventDefault();
    submit(formData, { method: "post" })
  };
  const [err, setErr] = useState("");
  const [formData, setFormData] = useState<Omit<User, "ID">>({
    name: "",
    short: "",
    email: "",
  });
  return (
    <div>
      <Dialog.Title className="pl-2 font-bold text-lg">Add User</Dialog.Title>
      <Dialog.Description className="break-normal py-1">
        No registration required. Just add your real and arcade name
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
        <label className="my-1">
          <span className="block">Arcade Name:</span>
          <input
            name="short"
            type="text"
            value={formData.short}
            onChange={handleChange}
            placeholder="AAA"
            required={true}
            maxLength={3}
            pattern={"[A-Z]{3}"}
            className="p-1 outline outline-1 outline-stone-400 rounded-md invalid:outline-red-400 valid:outline-green-500"
          />
        </label>
        <label className="my-1">
          <span className="block">Email (optional):</span>
          <input
            name="email"
            type="text"
            placeholder="your@email.com"
            value={formData.email}
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
            disabled={err.length > 0}
            className="mx-3 px-2 py-1 bg-violet-700 disabled:bg-slate-600 rounded-lg"
          >
            Add New User
          </button>
        </div>
        <div className={"text-red-600 " + (!!err ? "" : "display-none")}>{err}</div>
      </form>
    </div>
  );
}

export default UserForm;
