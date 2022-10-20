import Game from "./Game";

export const generateGames = (
  boardPairings,
  players,
  results,
  info,
  division = 0
) => {
  console.log("generating games");

  const games = boardPairings.map(({ round, pairings }) => {
    const pairingResults = results[division].scores.find(
      (r) => r.round === round
    ).pairResults;

    return pairings.map(([whiteId, blackId], index) => {
      const white = players[division].entries.find(({ chessResulsSeed }) => chessResulsSeed === whiteId);
      const black = players[division].entries.find(({ chessResulsSeed }) => chessResulsSeed === blackId);
      const result = pairingResults[index].join("-");
      const game = new Game({
        eventId: info.eventId,
        eventName: info.eventName,
        division: division + 1,
        round,
        whiteMemberId: white?.memberId,
        whiteRating: white?.ratingInfo?.rating,
        whiteName: white?.name,
        blackMemberId: black?.memberId,
        blackRating: black?.ratingInfo?.rating,
        blackName: black?.name,
        result,
        date: info.date,
        type: "standard",
      }).game;
      return game;
    }).filter((g) => g.whiteMemberId !== undefined && g.blackMemberId !== undefined);
  });
  return games
};

export const resultCheck = (boardPairings, players, results, settings) => {
  const resultBySeed = [];
  boardPairings
    .slice(0, settings.currentRound)
    .forEach(({ round, pairings }) => {
      const pairingResults = results.find((r) => r.round === round).pairResults;
      pairings.forEach((board, index) => {
        const whitePlayer = board[0];
        const blackPlayer = board[1];
        const whiteResultOfSeed = pairingResults[index][0];
        const blackResultOfSeed = pairingResults[index][1];
        resultBySeed.push(
          {
            chessResulsSeed: whitePlayer,
            result: whiteResultOfSeed,
            opponent: blackPlayer,
            color: "W",
            round,
          },
          {
            chessResulsSeed: blackPlayer,
            result: blackResultOfSeed,
            opponent: whitePlayer,
            color: "B",
            round,
          }
        );
      });
    });

  const allRounds = resultBySeed.reduce(
    (player, { result, opponent, color, chessResulsSeed }) => {
      if (!player[chessResulsSeed]) {
        const p = players.find((p) => p.chessResulsSeed === chessResulsSeed);
        if (p) {
          player[chessResulsSeed] = {
            rounds: [result],
            chessResulsSeed,
            opponents: [opponent],
            colors: [color],
            total: result || 0,
            name: p.name,
            rating: p.ratingInfo.rating,
            title: p.title ? p.title : "",
          };
        }
      } else {
        player[chessResulsSeed].rounds.push(result);
        player[chessResulsSeed].opponents.push(opponent);
        player[chessResulsSeed].colors.push(color);
        player[chessResulsSeed].total += result || 0;
      }

      return player;
    },
    {}
  );

  const roundByRound = Object.values(allRounds).sort(
    (a, b) => Number(b.total) - Number(a.total)
  );

  return { resultBySeed, roundByRound };
};
