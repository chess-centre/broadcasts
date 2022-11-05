import React from "react";
import { Standings } from "../Shared/Standings";
import { PairingsTable } from "../Shared/Pairings";
import { resultCheck } from "../Shared/ResultsChecker";

import { gamesJson  } from "./generate";

console.log(gamesJson);

const addSeeding = (players) =>
  players.map((player, idx) => ({ ...player, seed: idx + 1 }));

export default function Rapidplay({
  title,
  pairings,
  entries,
  results,
  settings,
  icon,
  boards,
}) {
  const players = addSeeding(entries);

  const { roundByRound } = resultCheck(pairings, players, results, settings);

  return (
    <div className="grid grid-cols-1 space-y-2">
      <Standings
        roundByRound={roundByRound}
        division={title}
        icon={icon}
        settings={settings}
      ></Standings>

      {!settings.showAll &&
        pairings
          .slice(settings.currentRound - 1, settings.currentRound)
          .map((pairings, key) => (
            <PairingsTable
              key={key}
              format={pairings}
              players={players}
              results={results}
              indexer={boards}
              settings={settings}
            />
          ))}

      {settings.showAll &&
        pairings.map((pairings, key) => (
          <PairingsTable
            key={key}
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
