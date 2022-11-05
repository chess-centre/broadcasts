const newParse = require("@mliebelt/pgn-parser").parse;

function parseGame(pgn) {
  try {
    const {
      tags: { White, Black, Result, WhiteElo, BlackElo }
    } = newParse(pgn)[0];
    
    return {
      lastMove: "",
      gameResult: Result,
      whiteInfo: { name: White, rating: WhiteElo },
      blackInfo: { name: Black, rating: BlackElo },
      whiteClock: "",
      blackClock: "",
      pgn,
    };
  } catch (e) {
    console.log("parsing error");
    return {
      pgn,
    };
  }
}

module.exports = parseGame;
