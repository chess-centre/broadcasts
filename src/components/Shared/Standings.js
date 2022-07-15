import { useState } from "react";
import SettingsToggle from "./SettingsToggle";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Standings = ({ roundByRound, settings, showTitle = false }) => {
  const [showOpponents, setShowOpponents] = useState(
    settings.showOpponentPairing
  );
  const [showPairingColors, setShowPairingColors] = useState(
    settings.showPairingColors
  );

  return (
    <div className={classNames("border border-slate-900 shadow-lg")}>
      <table className="w-full divide-y divide-slate-900">
        <thead className="bg-orange-500">
          <tr>
            <th
              scope="col"
              className="px-1 py-3 text-left text-sm font-medium text-orange-900 uppercase tracking-wider"
            >
              Pos.
            </th>
            {showTitle &&
              <th
                scope="col"
                className="px-1 py-3 text-left text-sm font-medium text-orange-900 uppercase tracking-wider"
              >
                Title
              </th>}
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-orange-900 uppercase tracking-wider"
            >
              Player
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-center text-sm font-medium text-orange-900 uppercase tracking-wider"
            >
              Rating
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-orange-900 uppercase tracking-wider"
            >
              Round by Round
            </th>
            <th
              scope="col"
              className="relative px-6 py-3 text-center text-sm font-medium text-orange-900 uppercase tracking-wider"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-slate-700 divide-y divide-slate-900">
          <tr className="px-1 py-1 border-slate-700">
            <td className="px-1 py-1 border-slate-700"></td>
          </tr>
          {roundByRound.map((data, key) => {
            const position = key + 1;
            const isEven = key % 2 === 0;

            return (
              <tr
                key={key}
                className={
                  isEven
                    ? "bg-slate-800 hover:bg-pink-900 hover:opacity-90"
                    : "bg-slate-900 hover:bg-pink-900 hover:opacity-90"
                }
              >
                <td className="border-r border-slate-700 px-1 py-2 text-md whitespace-nowrap text-center text-slate-50">
                  {position}
                </td>
                {showTitle &&
                  <td className="px-0 py-2 text-md whitespace-nowrap text-center text-slate-50">
                    <span className="text-yellow-400 font-bold">
                      {data.title}
                    </span>
                  </td>}
                <td className="pl-4 text-left px-4 py-2 whitespace-nowrap text-md text-white">
                  {data.name}
                </td>
                <td className="border-r border-slate-700 px-1 py-2 text-md whitespace-nowrap text-center text-white">
                  <span className="text-cyan-400 font-medium">
                    {data.rating ? data.rating : "unrated"}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap font-medium text-md text-slate-700 border-r border-slate-700 ">
                  <div className="flex">
                    {data.rounds
                      .slice(0, settings.currentRound)
                      .map((r, idx) => {
                        const isLive =
                          idx + 1 === settings.currentRound &&
                          settings.roundLive;
                        const isFutureRound = idx + 1 > settings.currentRound;
                        const opponent = data.opponents[idx];
                        const color = data.colors[idx];
                        const opponentPosition =
                          roundByRound.findIndex((p) => p.seed === opponent) +
                          1;

                        return (
                          <div key={idx}>
                            <ResultCell
                              idx={idx}
                              result={r}
                              isLive={isLive}
                              isFutureRound={isFutureRound}
                              opponent={opponentPosition}
                              color={color}
                              showPairing={showOpponents}
                              showColors={showPairingColors}
                            />
                          </div>
                        );
                      })}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-2 whitespace-nowrap text-center font-bold text-slate-100">
                  <Total value={data.total} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot></tfoot>
      </table>
      {/* <div className="relative">
        <div className="flex float-right mr-2">
          <div className="my-1 mr-6">
            <SettingsToggle
              name="Show Opponents"
              enabled={showOpponents}
              setEnabled={setShowOpponents}
            />
          </div>
          <div className="my-1">
            <SettingsToggle
              name="Show Colors"
              enabled={showPairingColors}
              setEnabled={setShowPairingColors}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

function Total({ value }) {
  if (value % 1 !== 0) {
    return Math.floor(value) === 0 ? "½" : `${Math.floor(value)}½`;
  }
  return value;
}

function ResultCell({
  idx,
  result,
  isLive,
  isFutureRound,
  opponent,
  color,
  showPairing,
  showColors,
}) {
  const OpponentPairing = () =>
    showPairing && (
      <span className="absolute text-xs -mt-1 text-slate-100 right-2">
        {opponent}
      </span>
    );

  const PairingColor = () =>
    showColors && (
      <span className="absolute text-xs -mt-1 text-slate-100 left-2">
        {color}
      </span>
    );



  if (result === 1) {
    return (
      <div key={idx} className="relative px-2 w-12">
        <PairingColor />
        <span className="text-green-500">{result}</span>
        <OpponentPairing />
      </div>
    );
  }

  if (result === 0.5) {
    return (
      <div key={idx} className="relative px-2 w-12">
        <PairingColor />
        <span className="text-cyan-500">½</span>
        <OpponentPairing />
      </div>
    );
  }

  if (result === 0) {
    return (
      <div key={idx} className="relative px-2 w-12">
        <PairingColor />
        <span className="text-red-500">{result}</span>
        <OpponentPairing />
      </div>
    );
  }

  if (isLive) {
    return (
      <div key={idx} className="px-2 w-12">
        <span className="text-orange-500 animate-pulse">Live</span>
      </div>
    );
  }

  if (isFutureRound) {
    return <div key={idx} className="px-2 w-12"></div>;
  }

  return (
    <div key={idx} className="px-2 w-12">
      x
    </div>
  );
}
