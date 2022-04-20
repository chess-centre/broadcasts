const pgnParser = require("pgn-parser");

function parseGame(pgn) {
  let lastMove = "";
  let whiteInfo = {
    name: "",
    rating: "",
  };
  let blackInfo = {
    name: "",
    rating: "",
  };
  let whiteClock = "";
  let blackClock = "";
  let gameResult = "";

  try {
    const [parsed] = pgnParser.parse(pgn);
    const moves = parsed.moves;
    const result = parsed.result;

    const whiteName = parsed?.headers?.find(
      ({ name }) => name === "White"
    )?.value;
    const whiteRating = parsed?.headers?.find(
      ({ name }) => name === "WhiteElo"
    )?.value;
    const blackName = parsed?.headers?.find(
      ({ name }) => name === "Black"
    )?.value;
    const blackRating = parsed?.headers?.find(
      ({ name }) => name === "BlackElo"
    )?.value;

    if (whiteName) {
      whiteInfo.name = whiteName;
    }
    if (whiteRating) {
      whiteInfo.rating = whiteRating;
    }
    if (blackName) {
      blackInfo.name = blackName;
    }
    if (blackRating) {
      blackInfo.rating = blackRating;
    }

    if (moves) {
      if (moves[moves.length - 1].move_number) {
        lastMove = `${moves[moves.length - 1].move_number}. ${
          moves[moves.length - 1].move
        }`;

        const whiteTime = moves[moves.length - 1]?.comments[0].commands.find(
          ({ key }) => key === "clk"
        ).values[0];

        const blackTime = moves[moves.length - 2]?.comments[0]?.commands.find(
          ({ key }) => key === "clk"
        ).values[0];

        if (blackTime) {
          blackClock = blackTime;
        }

        if (whiteTime) {
          whiteClock = whiteTime;
        }

      } else {
        lastMove = `${moves[moves.length - 2].move_number}. ... ${
          moves[moves.length - 1].move
        }`;

        const whiteTime = moves[moves.length - 2]?.comments[0].commands.find(
          ({ key }) => key === "clk"
        ).values[0];

        const blackTime = moves[moves.length - 3]?.comments[0]?.commands.find(
          ({ key }) => key === "clk"
        ).values[0];

        if (blackTime) {
          blackClock = blackTime;
        }

        if (whiteTime) {
          whiteClock = whiteTime;
        }
      }
    }

    if (result) {
      gameResult = result;
    }

    return {
      lastMove,
      gameResult,
      whiteInfo,
      blackInfo,
      whiteClock,
      blackClock,
      pgn
    };
  } catch (e) {
    return {
      lastMove,
      gameResult,
      whiteInfo,
      blackInfo,
      whiteClock,
      blackClock,
      pgn
    };
  }
}

module.exports = parseGame;
