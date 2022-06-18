export const MiniPairingsTable = ({
  format,
  players,
  results,
  indexer,
  settings,
}) => {
  const { round, pairings } = format;
  const isLive = round === settings.currentRound && settings.roundLive;

  return (
    <div>
      <table className="w-full divide-y divide-slate-900 table-auto border-slate-900 border shadow-lg">
        <thead className="bg-cyan-700">
          <tr>
            <th
              scope="col"
              className="px-1 py-1 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              Brd.
            </th>
            <th
              scope="col"
              className="flex-grow-0 w-80 px-2 sm:px-4 py-2 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              White
            </th>
            <th
              scope="col"
              className="flex-grow-0 w-80 px-2 sm:px-4 py-2 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              Rating
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-1 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              Vs
            </th>
            <th
              scope="col"
              className="flex-grow-0 w-80 px-2 sm:px-4 py-2 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              Rating
            </th>
            <th
              scope="col"
              className="flex-grow-0 w-80 px-4 sm:px-6 py-1 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              Black
            </th>
          </tr>
        </thead>
        <tbody className="bg-slate-700">
          <tr className="border border-r border-slate-900">
            <td></td>
            <td></td>
            <td></td>
            <td className="px-1 py-1 border-slate-700 text-center text-slate-500">Round { round }</td>
          </tr>
          {pairings.map((p, key) => {
            const [white, black] = results.find((r) => r.round === round)
              .pairResults[key];
            const whitePlayer = players.find((player) => player.seed === p[0]);
            const blackPlayer = players.find((player) => player.seed === p[1]);
            const isEven = key % 2 === 0;
            return (
              <tr
                key={key}
                className={isEven ? "bg-slate-800" : "bg-slate-900"}
              >
                <td
                  className={
                    isEven
                      ? "bg-slate-800 px-2 py-3 border-r border-slate-700 text-xs text-white"
                      : "bg-slate-900 px-2 py-3 border-r border-slate-700 text-xs text-white"
                  }
                >
                  {indexer * 3 + 1 + key}
                </td>
                <td className="flex-grow-0 max-w-full px-2 py-2 whitespace-nowrap text-md text-right text-white">
                  {whitePlayer.name ? (
                    whitePlayer.name
                  ) : (
                    <span className="text-sx">TBC</span>
                  )}
                </td>
                <td className="px-2 whitespace-nowrap text-center text-sm font-medium text-white">
                  <span className="text-cyan-400">
                    {whitePlayer.ratingInfo.rating === "blank"
                      ? ""
                      : whitePlayer.ratingInfo.rating
                      ? `${whitePlayer.ratingInfo.rating}`
                      : "unrated"}
                  </span>
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-center text-md border-slate-700 border-l border-r text-white">
                  {white || black ? (
                    `${white === 0.5 ? "½" : white} - ${
                      black === 0.5 ? "½" : black
                    }`
                  ) : isLive ? (
                    <span className="text-orange-500 animate-pulse">
                      Live
                    </span>
                  ) : (
                    "? - ?"
                  )}
                </td>
                <td className="px-2 whitespace-nowrap text-center text-sm font-medium text-white">
                  <span className="text-cyan-400">
                    {blackPlayer.ratingInfo.rating === "blank" ? (
                      <span className="text-white">Blank</span>
                    ) : blackPlayer.ratingInfo.rating ? (
                      `${blackPlayer.ratingInfo.rating}`
                    ) : (
                      "unrated"
                    )}
                  </span>
                </td>
                <td className="flex-grow-0 max-w-full px-2 py-2 whitespace-nowrap text-left text-md text-white">
                  {blackPlayer.name ? (
                    blackPlayer.name
                  ) : (
                    <span className="text-sx">TBC</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
