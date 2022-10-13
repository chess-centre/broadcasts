export const MatchTable = ({
    teams,
    results,
    round,
    whiteOnOdd,
    showRating = true,
    isLive = false,
  }) => {
    const homeTeam = teams.homeTeam.players;
    const awayTeam = teams.awayTeam.players;
  
    const homeRatingAverage = Math.floor(
      homeTeam.reduce((pre, cur) => (pre += cur.rating), 0) /
        (homeTeam.length)
    );
    const awayRatingAverage = Math.floor(
      awayTeam.reduce((pre, cur) => (pre += cur.rating), 0) / awayTeam.length
    );
  
    let homeScore = 0;
    let awayScore = 0;
    return (
      <div className="inline-block">
        <table className="w-full divide-y divide-slate-900">
          <thead className="bg-orange-brand">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-orange-900 uppercase tracking-wider">
                Brd.
              </th>
              <th className="px-1 py-2 text-center text-xs font-medium text-orange-900 uppercase tracking-wider"></th>
              <th className="flex-grow-0 w-80 px-2 sm:px-4 py-2 text-center text-xs font-medium text-orange-900 uppercase tracking-wider">
                Ilkley Dragons
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-orange-900 uppercase tracking-wider"></th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-orange-900  uppercase tracking-wider">
                Vs
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-orange-900 uppercase tracking-wider"></th>
  
              <th className="flex-grow-0 w-80 px-4 sm:px-6 py-3 text-center text-xs font-medium text-orange-900 uppercase tracking-wider">
                Hull DCA B
              </th>
              <th className="px-1 py-2 text-center text-xs font-medium text-orange-900 uppercase tracking-wider"></th>
              <th className="px-2 py-2 text-center text-xs font-medium text-orange-900 uppercase tracking-wider">
                Brd.
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-700 divide-y divide-slate-900">
            <tr>
              <td className="px-1 py-1 border-slate-700" colSpan="9"></td>
            </tr>
            {homeTeam.map((p, key) => {
              const [home, away] = results.find(
                (r) => r.round === round
              ).pairResults[key];
              homeScore += home ? home : 0;
              awayScore += away ? away : 0;
              const isEven = key % 2 === 0 ? true : false;
              const homeColour = whiteOnOdd
                ? isEven
                  ? "W"
                  : "B"
                : isEven
                ? "B"
                : "W";
              const awayColour = whiteOnOdd
                ? isEven
                  ? "B"
                  : "W"
                : isEven
                ? "W"
                : "B";
              const hPlayer = p;
              const aPlayer = awayTeam[key];
              return (
                <tr
                  key={key}
                  className={
                    isEven
                      ? "bg-slate-800 hover:bg-pink-900 hover:opacity-90 text-white"
                      : "bg-slate-900 hover:bg-pink-900 hover:opacity-90 text-white"
                  }
                >
                  <td className="px-1 py-3 border-r border-slate-700 text-xs">
                    {key + 1}
                  </td>
                  <td className="px-1 py-3 border-r border-slate-700 text-xs">
                    {homeColour === "W" ? (
                      <span>W</span>
                    ) : (
                      <span>B</span>
                    )}
                  </td>
                  <td
                    className={
                      homeColour === "W"
                        ? "pl-4 px-4 py-2 whitespace-nowrap text-center text-white text-lg font-medium border-r border-slate-700"
                        : "pl-4 px-4 py-2 whitespace-nowrap text-center text-slate-400 text-lg font-medium border-r border-slate-700"
                    }
                  >
                    {hPlayer.name}
                  </td>
                  <td className=" px-2 py-3 border-r text-lg border-slate-700 text-cyan-400">
                    {showRating && (hPlayer.rating ? hPlayer.rating : "unrated")}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center text-md  border-r border-slate-700 ">
                    {home || away ? (
                      `${home === 0.5 ? "½" : home} - ${
                        away === 0.5 ? "½" : away
                      }`
                    ) : isLive ? (
                      <span className="text-orange-brand animate-pulse">
                        Live
                      </span>
                    ) : (
                      "? - ?"
                    )}
                  </td>
                  <td className="px-2 py-3 border-l text-lg border-r text-cyan-400 border-slate-700">
                    {showRating && (aPlayer.rating ? aPlayer.rating : "unrated")}
                  </td>
                  <td
                    className={
                      awayColour === "W"
                        ? "pl-4 px-4 py-2 whitespace-nowrap text-center text-slate-400 text-lg font-medium border-r border-slate-700"
                        : "pl-4 px-4 py-2 whitespace-nowrap text-center text-white text-lg font-medium border-r border-slate-700"
                    }
                  >
                    {aPlayer.name}
                  </td>
                  <td className="px-1 py-3 border-l text-xs border-r border-slate-700">
                    {awayColour === "W" ? (
                      <span>W</span>
                    ) : (
                      <span>B</span>
                    )}
                  </td>
                  <td className="px-1 py-3 border-r border-slate-700 text-xs">
                    {key + 1}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="px-1 py-1 border-slate-700" colSpan="9"></td>
            </tr>
            <tr className="bg-slate-700">
              <td></td>
              <td></td>
              <td></td>
              <td>
                <span className="inline-flex items-center px-4 py-2 rounded text-xs font-medium bg-slate-800 border-2 border-cyan-600 text-slate-300">
                  Av. {homeRatingAverage}
                </span>
              </td>
              <td className="px-4 py-2 text-center text-4xl font-medium text-white border border-slate-900 bg-cyan-brand">
                {`${homeScore} - ${awayScore}`}
              </td>
              <td>
                <span className="inline-flex items-center px-4 py-2 rounded text-xs font-medium bg-slate-800 border-2 border-cyan-600 text-slate-300">
                  Av. {awayRatingAverage}
                </span>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };