const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs").promises;
const port = 8080;
// TODO: add to config
const BASE_PATH = "C:/Users/user/Desktop/Live";

// require for react app requests
app.use(cors());

app.get("/:round/:board", async (req, res) => {
  const { board, round } = req.params;
  const result = await getPgn(round, board);
  res.send(result);
});

app.listen(port, () => {
  console.log(`PGN API started on port ${port}`);
});

app.get("/favicon.ico", (req, res) => res.status(204));

const getPgn = async (round, board) => {
  const path = `${BASE_PATH}/round-${round}/game-${board}.pgn`;
  const pgn = await fs.readFile(path, "utf-8").catch((error) => {
    console.log(error);
    return "";
  });
  return pgn;
};
