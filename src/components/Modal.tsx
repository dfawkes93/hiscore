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
          return <UserForm handleSubmit={submitHandler} setOpen={setOpen} />;
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
    >
      <Dialog.Panel
        className="bg-indigo-100 p-2 rounded-lg border-2 border-indigo-800"
      >
        {generateContent(modalContent)}
      </Dialog.Panel>
    </Dialog>
  );
}

export default Modal;
