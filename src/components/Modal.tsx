import { ReactNode, useState } from "react";
import { Dialog } from "@headlessui/react";
import UserForm from "./UserForm";
import { DataTypes } from "../Models";

function Modal({
  open,
  setOpen,
  modalContent,
  submitHandler,
}: {
  open: boolean;
  setOpen: any;
  modalContent: DataTypes;
  submitHandler: any;
}) {
  const generateContent = (modalContent: DataTypes) => {
    {
      switch (modalContent) {
        case DataTypes.User:
          return <UserForm handleSubmit={submitHandler} />;
        case DataTypes.Score:
          break;
        case DataTypes.Game:
          break;
      }
    }
    return <p></p>;
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-indigo-800"
    >
      <Dialog.Panel className="bg-slate-300">
        <Dialog.Title>Do Modal Stuff</Dialog.Title>
        <Dialog.Description>
          This modal will let you do modal things
        </Dialog.Description>

        {generateContent(modalContent)}
        <p>Lorem ipsum blah how cool are modals tho</p>

        <button
          onClick={() => {
            setOpen(false);
          }}
        >
          Do a thing
        </button>
        <button
          onClick={() => {
            setOpen(false);
          }}
        >
          Woah hold up
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}

export default Modal;
