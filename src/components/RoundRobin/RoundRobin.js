import React from "react";
import { Standings } from "../Shared/Standings";
import { PairingsTable } from "../Shared/Pairings";
import { resultCheck } from "../Shared/ResultsChecker";

const SixPlayerPairings = [
  {
    round: 1,
    pairings: [
      [1, 6],
      [2, 5],
      [3, 4],
    ],
  },
  {
    round: 2,
    pairings: [
      [6, 4],
      [5, 3],
      [1, 2],
    ],
  },
  {
    round: 3,
    pairings: [
      [2, 6],
      [3, 1],
      [4, 5],
    ],
  },
  {
    round: 4,
    pairings: [
      [6, 5],
      [1, 4],
      [2, 3],
    ],
  },
  {
    round: 5,
    pairings: [
      [3, 6],
      [4, 2],
      [5, 1],
    ],
  },
];

const addSeeding = (players) =>
  players.map((player, idx) => ({ ...player, seed: idx + 1 }));

export default function Rapidplay({ title, entries, results, settings, icon, boards }) {
  const players = addSeeding(entries);

  const { roundByRound } = resultCheck(SixPlayerPairings, players, results, settings);

  return (
    <div className="grid grid-cols-1 gap-3 mt-2">
      <Standings roundByRound={roundByRound} division={title} icon={icon} settings={settings}></Standings>

      {!settings.showAll &&
        SixPlayerPairings.slice(
          settings.currentRound - 1,
          settings.currentRound
        ).map((pairings) => (
          <PairingsTable
            format={pairings}
            players={players}
            results={results}
            indexer={boards}
            settings={settings}
          />
        ))}

      {settings.showAll &&
        SixPlayerPairings.map((pairings, key) => (
          <PairingsTable
            format={pairings}
            players={players}
            results={results}
            indexer={boards}
            settings={settings}
          />
        ))}
    </div>
  );
}
