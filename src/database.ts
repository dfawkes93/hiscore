import { Score, User, Game } from "./Models";
import config from "../res/data.js";
const PORT = config.PORT || 2424;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function getUsers(id?: number) {
  let endpoint = "/api/users".concat(id ? `/${id}` : "");
  return (await fetch(`http://localhost:${PORT}${endpoint}`, {
    headers: headers,
  }).then((response) => response.json())) as User[];
}

export async function addUser(user: Partial<User>) {
  let endpoint = "/api/users";
  if (user.name === undefined || user.short === undefined) {
    return Promise.reject({ message: "Incomplete request" });
  }
  return await fetch(`http://localhost:${PORT}${endpoint}`, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(user),
  }).then((response) => {
    if (response.status === 400) {
      return Promise.reject({ message: "Duplicate entry" });
    }
    return response.json();
  });
}

export async function getGames() {
  let endpoint = "/api/games";
  return (await fetch(`http://localhost:${PORT}${endpoint}`, {
    headers: headers,
  }).then((response) => response.json())) as Game[];
}

export async function addGame(game: Partial<Game>) {
  let endpoint = "/api/games";
  if (game.name === undefined) {
    return Promise.reject({ message: "Incomplete request" });
  }
  return await fetch(`http://localhost:${PORT}${endpoint}`, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(game),
  }).then((response) => {
    if (response.status === 400) {
      return Promise.reject({ message: "Duplicate entry" });
    }
    return response.json();
  });
}

export async function getGameScores(game: Partial<Game>) {
  let endpoint = "/api/scores";
  return (await fetch(
    `http://localhost:${PORT}${endpoint}?` +
      new URLSearchParams({ game: (game?.ID || 1).toString() }),
    { headers: headers }
  ).then((response) => response.json())) as Score[];
}

export async function addScore(score: Partial<Score>) {
  let endpoint = "/api/scores";
  return await fetch(`http://localhost:${PORT}${endpoint}`, {
    headers: headers,
    method: "POST",
    body: JSON.stringify({ score: score.score, game: score.gameId, player: score.playerId }),
  }).then((response) => {
    if (response.status === 400) {
      return Promise.reject({ message: "Unable to add score" });
    }
    return response.json();
  });
}
