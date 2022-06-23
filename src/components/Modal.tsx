import { ReactNode, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { DataTypes } from "../Models";
import UserForm from "./UserForm";
import GameForm from "./GameForm";
import ScoreForm from "./ScoreForm";

function Modal({
  open,
  setOpen,
  modalType,
  modalContent,
  submitHandler,
}: {
  open: boolean;
  setOpen: any;
  modalType: DataTypes;
  modalContent?: any;
  submitHandler: any;
}) {


  //const [content, setContent] = useState({game:"",user:""});

  const generateType = (modalType: DataTypes, submitHandler: any, setOpen: any, modalContent?: any) => {
    {
      if (modalType === undefined) {
          return <p>{modalContent}</p>
      }
      switch (modalType) {
        case DataTypes.User:
          return <UserForm handleSubmit={submitHandler} setOpen={setOpen}/>;
        case DataTypes.Score:
          return <ScoreForm handleSubmit={submitHandler} setOpen={setOpen} data={modalContent}/>;
        case DataTypes.Game:
          return <GameForm handleSubmit={submitHandler} setOpen={setOpen}/>;
        default:
          return <div/>
      }
    }
  };

  //const [type, setType] = useState(generateType());

  //useEffect(() => {
   //   setType(generateType(modalContent));
  //}, [modalType, modalContent]);

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
        {generateType(modalType, submitHandler, setOpen, modalContent)}
      </Dialog.Panel>
    </Dialog>
  );
}

export default Modal;
