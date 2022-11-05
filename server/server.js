const express = require("express");
const app = express();
const ws = require("express-ws")(app);
const chokidar = require("chokidar");
const cors = require("cors");
const fs = require("fs").promises;
const parseGame = require("./parse-game");

const port = 8080;
// TODO: add to config
const BASE_PATH = "C:/Users/user/Desktop/Live";

// require for react app requests
app.use(cors());

app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/:round/:board", async (req, res) => {
  const { board, round } = req.params;
  const result = await getPgn(round, board);
  res.json(result);
});

app.ws("/", async (s, req) => {
  console.log("Websocket Connection: Ready");

  try {
    const files = await getFiles(1);
    files
      .filter((f) => f.endsWith(".pgn") && f.includes("game-"))
      .forEach((f) => {
        watchFile(1, f, async (file) => {
          const data = await getPgn(file);
          s.send(JSON.stringify(data));
        });
      });
  } catch (error) {
    console.log("Error", error);
    s.send("Error: oops, something went wrong!");
  }
});

app.listen(port, () => {
  console.log(`File Reader: pgn API started on port ${port}`);
});

const getPgn = async (path) => {
  console.log(`GET: returning pgn for ${path}`);
  const pgn = await fs.readFile(path, "utf-8").catch(console.error);
  const parsed = parseGame(pgn);
  return parsed;
};

const getFiles = async (round) => {
  return await fs.readdir(`${BASE_PATH}/round-${round}`, (err, files) => {
    if (err) return [];
    return files.filter((file) => file.endsWith(".pgn"));
  });
};

const watchFile = async (round, file, cb) => {
  const path = `${BASE_PATH}/round-${round}/${file}`;
  const watcher = chokidar.watch(path, {
    persistent: true,
  });
  watcher.on("change", (path, stats) => {
    if (stats) {
      cb(path);
    }
  });
};
