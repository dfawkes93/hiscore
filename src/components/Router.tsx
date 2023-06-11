import {
  createBrowserRouter,
  Outlet,
  redirect,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import ScoreTable from "../ScoreTable";
import { getGames } from "../database";
import { getSortFunction } from "../utils/sorting";
import { Game } from "../Models";
import App from "../App";
import { modalRoutes } from "../components/Modal";

function GameList() {
  const [searchParams] = useSearchParams();
  const find = searchParams.get("q") ?? "";
  const sort = Number(searchParams.get("sort") ?? 0)
  const games = useLoaderData() as Game[];

  if (games.length == 1) {
    return (
      <>
        <ScoreTable key={games[0].name} game={games[0]} />
        <Outlet />
      </>
    )
  }
  return (
    <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-evenly justify-items-center">
      {games
      .filter((game) => game.name.toLowerCase().includes(find.toLowerCase()))
      .sort(getSortFunction(sort))
        .map((e) => (
          <ScoreTable key={e.name} game={e} limit={5} />
        ))}
      <Outlet />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <App />,
    children: [
      {
        index: true,
        loader: ({ request }) => {
          const url = new URL(request.url)
          return redirect(`/games${"?" + url.searchParams.toString() ?? ""}`)
        }
      },
      {
        path: "games/:name?",
        loader: async ({ request, params }) => {
          const games = await getGames()
          const search = params.name ?? "";
          return search ? [games.find(({ name }) =>
            name.toLowerCase().includes(search.toLowerCase())
          )] : games
        },
        element: <GameList />,
        children: modalRoutes,
        shouldRevalidate: ({ currentUrl, nextUrl }) => { return !(currentUrl.pathname.includes("/new") || nextUrl.pathname.includes("/new")) }
      },
    ],
  },
]);

export default createBrowserRouter
