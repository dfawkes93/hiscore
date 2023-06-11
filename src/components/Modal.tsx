import { Dialog } from "@headlessui/react";
import { DataTypes } from "../Models";
import UserForm from "./UserForm";
import GameForm from "./GameForm";
import ScoreForm from "./ScoreForm";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouteObject,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { addGame, addScore, addUser, getGames, getUsers } from "../database";

export const modalRoutes: RouteObject[] = [
  {
    path: "new",
    element: <Modal />,
    children: [
      {
        path: "score",
        index: true,
        element: <ScoreForm />,
        loader: () => getUsers(),
        action: (async ({ params, request }) => {
          let formData = await request.formData()
          addScore(Object.fromEntries(formData))
          return redirect("../../")
        })
      },
      {
        path: "user",
        element: <UserForm />,
        loader: () => getUsers(),
        action: (async ({ params, request }) => {
          let formData = await request.formData()
          addUser(Object.fromEntries(formData))
          return redirect("../../")
        })
      },
      {
        path: "game",
        element: <GameForm />,
        loader: () => getGames(),
        action: (async ({ params, request }) => {
          let formData = await request.formData()
          addGame(Object.fromEntries(formData))
          return redirect("../../")
        })
      },
    ],
  },
];

export function Modal() {
  const navigate = useNavigate();

  return (
    <Dialog
      open={true}
      onClose={() => {
        navigate(-1)
      }}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-indigo-100 p-2 rounded-lg border-2 border-indigo-800">
          <Outlet />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
