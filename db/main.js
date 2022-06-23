const Database = require("better-sqlite3");
const express = require("express");
const port = 8687;

const db = new Database("hiscore.db");
const app = express()
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type, Authorization"
    );
    next();
  })
  .use(express.json())
  .use(createRouter(db));

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

    const stmt = db.prepare(
      "SELECT USERS.short, USERS.name AS player, " +
        "GAMES.name as game, SCORES.score, SCORES.date FROM SCORES " +
        "INNER JOIN USERS ON USERS.ID = SCORES.player " +
        "INNER JOIN GAMES ON GAMES.ID = SCORES.game " +
        where +
        " ORDER BY SCORES.score DESC"
    );
    try {
      ret = stmt.all();
      res.json(ret);
    } catch (e) {
      console.log(e);
      res.status(400).json({ Error: e });
    }
  });

  // Post a new score
  router.post("/api/scores", (req, res) => {
    const { score, player, game } = req.body;
    const stmt = db.prepare(
      "INSERT INTO SCORES " +
        "(score, player, game, date) " +
        "VALUES (?,?,?, datetime('now'))"
    );
    return res.json(stmt.run(score, player, game));
  });

  // List games
  router.get("/api/games", (req, res) => {
    const stmt = db.prepare(
      'SELECT GAMES.ID, GAMES.name, COUNT(SCORES.ID) as "scores", ' +
        'COUNT(DISTINCT USERS.NAME) as "players", ' +
        'MAX(SCORES.date) as "lastUpdated" FROM GAMES ' +
        "LEFT JOIN SCORES ON GAMES.ID == SCORES.game " +
        "LEFT JOIN USERS ON USERS.ID == SCORES.player " +
        "GROUP BY GAMES.name " +
        "ORDER BY GAMES.ID "
    );
    return res.json(stmt.all());
  });
  router.get("/api/games/:id", (req, res) => {
    let where = ` WHERE ID = ${req.params.id}`;
    const stmt = db.prepare("SELECT * FROM GAMES" + where);
    return res.json(stmt.all());
  });

  // Add a new game
  router.post("/api/games", (req, res) => {
    const { name } = req.body;
    const stmt = db.prepare("INSERT INTO GAMES " + "(name)  VALUES (?)");
    try {
      ret = stmt.run(name);
      res.json(ret);
    } catch (e) {
      res.status(400).json({ Error: e.code });
    }
  });

  // List users
  router.get("/api/users", (req, res) => {
    const stmt = db.prepare("SELECT * FROM USERS");
    return res.json(stmt.all());
  });
  router.get("/api/users/:id", (req, res) => {
    let where = ` WHERE ID = ${req.params.id}` || "";
    const stmt = db.prepare("SELECT * FROM USERS" + where);
    return res.json(stmt.all());
  });

  // Add a new user
  router.post("/api/users", (req, res) => {
    const { name, short, email } = req.body;
    const stmt = db.prepare(
      "INSERT INTO USERS " + "(name, short, email) " + "VALUES (?,?,?)"
    );
    try {
      ret = stmt.run(name, short, email);
      res.json(ret);
    } catch (e) {
      res.status(400).json({ Error: e.code });
    }
  });

  return router;
}

app.listen(port, () => {
  console.log(`Hiscore DB running on port ${port}`);
});
