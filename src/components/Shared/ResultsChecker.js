import Game from "./Game";


export const generateGames = (boardPairings, players, results, info) => {

  console.log("generating games")

  return boardPairings.map(({ round, pairings }) => {

    const pairingResults = results[0].scores.find((r) => r.round === round).pairResults;

      return pairings.map(([whiteId, blackId], index) => {

        const white = players[0].entries.find(({ id }) => id === whiteId);
        const black = players[0].entries.find(({ id }) => id === blackId);;
        const result = pairingResults[index].join("-");

        const game = new Game({
          eventId: info.eventId,
          eventName: info.eventName,
          round,
          whiteMemberId: white.memberId,
          whiteRating: white.ratingInfo.rating,
          whiteName: white.name,
          blackMemberId: black.memberId,
          blackRating: black.ratingInfo.rating,
          blackName: black.name,
          result,
          date: info.date,
          type: "rapid",
        }).game;

        return game;
      });
  });
}

export const resultCheck = (boardPairings, players, results, settings) => {

  const resultBySeed = [];
  boardPairings.slice(0, settings.currentRound).forEach(({ round, pairings }) => {
    const pairingResults = results.find((r) => r.round === round).pairResults;
    pairings.forEach((board, index) => {
      const whitePlayer = board[0];
      const blackPlayer = board[1];
      const whiteResultOfSeed = pairingResults[index][0];
      const blackResultOfSeed = pairingResults[index][1];
      resultBySeed.push(
        {
          seed: whitePlayer,
          result: whiteResultOfSeed,
          opponent: blackPlayer,
          color: 'W',
          round,
        },
        {
          seed: blackPlayer,
          result: blackResultOfSeed,
          opponent: whitePlayer,
          color: 'B',
          round,
        }
      );
    });
  });

  const allRounds = resultBySeed.reduce((player, { seed, result, opponent, color }) => {
    if (!player[seed]) {
      const p = players.find((p) => p.seed === seed);
      player[seed] = {
        rounds: [result],
        seed,
        opponents: [opponent],
        colors: [color],
        total: result || 0,
        name: p.name,
        rating: p.ratingInfo.rating,
        title: p.title ? p.title : "",
      };
    } else {    
      player[seed].rounds.push(result);
      player[seed].opponents.push(opponent);
      player[seed].colors.push(color);
      player[seed].total += result || 0;
    }

    return player;
  }, {});

  const roundByRound = Object.values(allRounds)
              .sort((a, b) => Number(b.total) - Number(a.total));

  return { resultBySeed, roundByRound };
};


