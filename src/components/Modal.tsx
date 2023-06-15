import { Dialog } from "@headlessui/react";
import UserForm from "./UserForm";
import GameForm from "./GameForm";
import ScoreForm from "./ScoreForm";
import {
  Outlet,
  redirect,
  RouteObject,
  useNavigate,
} from "react-router-dom";
import { addGame, addScore, addUser, getGames, getUsers } from "../database";
import { ErrorBoundary } from "./Error";

export const modalRoutes: RouteObject[] = [
  {
    path: "new",
    element: <Modal />,
    children: [
      {
        path: "score",
        errorElement: <ErrorBoundary />,
        index: true,
        element: <ScoreForm />,
        loader: async () => getUsers(),
        action: async ({ request }) => {
          let formData = await request.formData()
          let ok = false
          await addScore(Object.fromEntries(formData)).then((res) => ok = res.ok)
          return ok ? redirect("../../") : null
        }
      },
      {
        path: "user",
        errorElement: <ErrorBoundary />,
        element: <UserForm />,
        loader: async () => getUsers(),
        action: async ({ request }) => {
          let formData = await request.formData()
          await addUser(Object.fromEntries(formData))
          return redirect("../../")
        }
      },
      {
        path: "game",
        errorElement: <ErrorBoundary />,
        element: <GameForm />,
        loader: async () => getGames(),
        action: async ({ request }) => {
          let formData = await request.formData()
          await addGame(Object.fromEntries(formData))
          return redirect("../../")
        }
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
