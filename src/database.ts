import { Score, User, Game } from "./Models";
import config from "../res/data.js";
const PORT = import.meta.env.PROD ? config.PORT : 8687;
const HOST = import.meta.env.PROD ? config.HOST : `localhost:${PORT}`
const PROTOCOL = import.meta.env.PROD ? config.PROTOCOL : "http"

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function getUsers(id?: number) {
  let endpoint = "/api/users".concat(id ? `/${id}` : "");
  return fetch(`${PROTOCOL}://${HOST}${endpoint}`, {
    headers: headers
  })
}

export async function addUser(user: Partial<User>) {
  let endpoint = "/api/users";
  if (user.name === undefined || user.short === undefined) {
    return { message: "Incomplete request" };
  }
  return fetch(`${PROTOCOL}://${HOST}${endpoint}`, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(user),
  })
}

export async function getGames() {
  let endpoint = "/api/games";
  return fetch(`${PROTOCOL}://${HOST}${endpoint}`, {
    headers: headers,
  })
}

export async function addGame(game: Partial<Game>) {
  let endpoint = "/api/games";
  if (game.name === undefined) {
    return { message: "Incomplete request" };
  }
  return fetch(`${PROTOCOL}://${HOST}${endpoint}`, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(game),
  })
}

export async function getGameScores(game: Partial<Game>) {
  let endpoint = "/api/scores";
  return fetch(
    `${PROTOCOL}://${HOST}${endpoint}?` +
    new URLSearchParams({ game: (game?.ID || 1).toString() }),
    { headers: headers }
  )
}

export async function addScore(score: Partial<Score>) {
  let endpoint = "/api/scores";
  return fetch(`${PROTOCOL}://${HOST}${endpoint}`, {
    headers: headers,
    method: "POST",
    body: JSON.stringify({ score: score.score, game: score.gameId, player: score.playerId }),
  })
}
