const Database = require('better-sqlite3')
const express = require('express')

const port = 8282;

const db = new Database('hiscore.db');
const app = express().use(createRouter(db));

function createRouter(db) {
    const router = express.Router();

    // Get scores for users/game
    router.get("/api/scores", (req, res) => {
        let where = "";
        if (req.query.player !== undefined) {
            where = `WHERE USERS.ID = ${req.query.player}`;
        }
        if (req.query.game !== undefined) {
            let suff = `GAMES.ID = ${req.query.game}`;
            if (where === "") {
                suff = "WHERE ".concat(suff);
            } else {
                suff = " AND ".concat(suff);
            }
            where = where.concat(suff);
        }

        const stmt = db.prepare("SELECT USERS.SHORT, USERS.NAME, " +
            "GAMES.NAME, SCORES.SCORE FROM SCORES " +
            "INNER JOIN USERS ON USERS.ID = SCORES.PLAYER " +
            "INNER JOIN GAMES ON GAMES.ID = SCORES.GAME " +
            where);
        ret = stmt.all();
        res.json(ret);
    });

    // Post a new score
    router.post("/api/scores", (req, res) => {
        //console.log(req.body);
        //const { score, player, game } = req.body;
        const score = 24
        const player = 1
        const game = 1
        const stmt = db.prepare('INSERT INTO SCORES ' +
            '(score, player, game, date) ' +
            "VALUES (?,?,?, datetime('now'))");
        return res.json(stmt.run(score, player, game));
    });

    // List games
    router.get("/api/games", (req, res) => {
        const stmt = db.prepare('SELECT * FROM GAMES');
        return res.json(stmt.all());
    });
    router.get("/api/games/:id", (req, res) => {
        let where = ` WHERE ID = ${req.params.id}` || ""
        const stmt = db.prepare('SELECT * FROM GAMES'+where);
        return res.json(stmt.all());
    });

    // Add a new game
    router.post("/api/games", (req, res) => {
        //do stuff
    });

    // List users
    router.get("/api/users", (req, res) => {
        const stmt = db.prepare('SELECT * FROM USERS');
        return res.json(stmt.all());
    });
    router.get("/api/users/:id", (req, res) => {
        let where = ` WHERE ID = ${req.params.id}` || ""
        const stmt = db.prepare('SELECT * FROM USERS'+where);
        return res.json(stmt.all());
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
