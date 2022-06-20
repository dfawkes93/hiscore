export enum DataTypes {
    "Game",
    "User",
    "Score"
}

export interface Game {
    ID: number,
    name: string
}

export interface User {
    ID: number,
    name: string,
    short: string,
    email: string
}

export interface Score {
    score: number,
    player: string,
    playerId?: number,
    short: string,
    game: string,
    gameId?: number,
    date: string
}
