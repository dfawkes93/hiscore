const Database = require('better-sqlite3')
const express = require('express')

const port = 8282;

const db = new Database('hiscore.db');
const app = express().use(createRouter(db));

function createRouter(db) {
    const router = express.Router();

    // Get scores for users/game
    router.get("/api/scores", (req, res) => {
        const stmt = db.prepare('SELECT USERS.SHORT, SCORES.SCORE FROM SCORES LEFT JOIN USERS ON USERS.ID = SCORES.PLAYER');
        console.log(stmt.get());
    });

    // Post a new score
    router.post("/api/scores", (req, res) => {
        //do stuff
    });

    // List games
    router.get("/api/games", (req, res) => {
        const stmt = db.prepare('SELECT * FROM GAMES');
        return res.json(stmt.get());
    });

    // Add a new game
    router.post("/api/games", (req, res) => {
        //do stuff
    });

    // List users
    router.get("/api/users", (req, res) => {
        const stmt = db.prepare('SELECT * FROM USERS');
        return res.json(stmt.get());
    });

    // Add a new user
    router.post("/api/users", (req, res) => {
        //do stuff
    });

    return router;
}

app.listen(port, () => {
    console.log(`Hiscore DB running on port ${port}`);
});
