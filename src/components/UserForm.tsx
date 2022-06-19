import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { DataTypes } from "../Models";

function UserForm({
  handleSubmit,
  setOpen,
}: {
  handleSubmit: any;
  setOpen: any;
}) {
  function handleChange(event: any) {
    const value = event.target.value as string;
    const name = event.target.name as "name" | "short" | "email";
    setFormData({ ...formData, [name]: value });
  }
  const doSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit(DataTypes.User, formData);
    setOpen(false);
  };
  const [formData, setFormData] = useState({
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
      <form onSubmit={doSubmit} className="grid grid-cols-1 justify-items-center">
        <label>
        <span className="block">Name:</span>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required={true}
        /></label>
        <label>
        <span className="block">Arcade Name:</span>
        <input 
          name="short"
          type="text"
          value={formData.short}
          onChange={handleChange}
          required={true}
          maxLength={3}
          pattern={"[A-Z]{1,3}"}
          className="border-2 border-stone-400 rounded-md invalid:border-red-400"
        /></label>
        <label>
        <span className="block">Email (optional):</span>
        <input
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
        /></label>
        <div id="buttonBar" className="inline pt-2 dark:text-stone-100 font-bold">
          <button className="mx-3 px-2 py-1 bg-violet-700 rounded-lg"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
          <button type="submit" className="mx-3 px-2 py-1 bg-violet-700 rounded-lg">Add New User</button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
