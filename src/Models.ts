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
    short: string,
    game: string,
    date: string
}
