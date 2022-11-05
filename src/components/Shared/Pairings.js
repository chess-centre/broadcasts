function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export const PairingsTable = ({ format, players, results, indexer, settings }) => {
  const { round, pairings } = format;
  const isLive = round === settings.currentRound && settings.roundLive;
  
  return (
    <div className="overflow-x-auto mb-2">
      <table className="w-full divide-y divide-slate-900 table-auto border-slate-900 border shadow-lg">
        <thead className="bg-cyan-700">
          <tr>
            <th
              scope="col"
              className="hidden sm:block px-1 py-2 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >Brd.
            </th>
            <th
              scope="col"
              className="flex-grow-0 w-80 px-2 sm:px-4 py-2 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              White
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              Vs
            </th>
            <th
              scope="col"
              className="flex-grow-0 w-80 px-4 sm:px-6 py-3 text-center text-xs font-medium text-cyan-400 uppercase tracking-wider"
            >
              Black
            </th>
          </tr>
        </thead>
        <tbody className="bg-slate-800">
          <tr className="border border-r border-slate-900 shadow-inner">
            {/* using colSpan=3 here means the header "VS" doesn't align center with the Round */}
            <td className="px-2 py-3 hidden sm:block"></td>
            <td className="px-2 sm:px-6 py-3"></td>
            <td colSpan={2} className="px-2 py-1 text-left text-sm sm:text-lg font-medium text-slate-100">
              <span className="hidden sm:block">Round {round}</span> 
            </td>
          </tr>
          {pairings.map((p, key) => {
            const [white, black] = results.find(r => r.round === round).pairResults[key];
            const whitePlayer = players.find(player => player.seed === p[0]);
            const blackPlayer = players.find(player => player.seed === p[1]);
            const isEven = key % 2 === 0;
            return (
              <tr key={key} className={isEven ? "bg-slate-800" : "bg-slate-900"}>
                <td className={classNames(isEven ? "bg-slate-800" : "bg-slate-900", 
                  "px-2 py-3 text-xs text-white hidden sm:block mt-3")}>
                  {(indexer * 3) + 1 + key}
                </td>
                <td className="flex-grow-0 max-w-full px-2 pl-4 sm:px-4 py-2 whitespace-nowrap text-center text-xs sm:text-lg sm:font-medium text-white border-slate-700 border-l border-r">
                  {whitePlayer.name ? (
                    whitePlayer.name.replace("stand in", "")
                  ) : (
                    <span className="text-xs">TBC</span>
                  )}{" "}
                  <br />
                  <span className="text-cyan-400">
                    {whitePlayer.ratingInfo.rating === "blank"
                      ? ""
                      : whitePlayer.ratingInfo.rating
                      ? `${whitePlayer.ratingInfo.rating}`
                      : "unrated"}
                  </span>
                </td>
                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-center text-sm border-slate-700 border-l border-r text-white">
                  {white || black
                    ? `${white === 0.5 ? "½" : white} - ${
                        black === 0.5 ? "½" : black
                      }`
                    : isLive ? <span className="text-orange-brand animate-pulse">Live</span> : "? - ?"}
                </td>
                <td className="flex-grow-0 max-w-full px-2 pl-4 sm:px-4 py-2 whitespace-nowrap text-center text-xs sm:text-lg sm:font-medium text-white">
                  {blackPlayer.name ? (
                    blackPlayer.name.replace("stand in", "")
                  ) : (
                    <span className="text-sx">TBC</span>
                  )}{" "}
                  <br />
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};