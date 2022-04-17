import React from "react";
import { Standings } from "../Shared/Standings";
import { MiniPairingsTable } from "../Shared/MiniPairing";
import { resultCheck } from "../Shared/ResultsChecker";
import ChessGame from "../../Game";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const addSeeding = (players) =>
  players.map((player, idx) => ({ ...player, seed: idx + 1 }));

export default function Swiss({
  title,
  entries,
  pairings,
  results,
  settings,
  icon,
  boards,
}) {
  const players = addSeeding(entries);
  const { roundByRound } = resultCheck(pairings, players, results, settings);

  return (
    <div className="grid grid-cols-12 gap-3 mt-2">
      <div className="col-span-1">
        <RoundTimes icon={icon} title={title} settings={settings} />
      </div>
      <div className="col-span-5">
        <div>
          <Standings
            key={1}
            roundByRound={roundByRound}
            division={title}
            icon={icon}
            settings={settings}
          />
        </div>
        <div className="grid grid-cols-1">
          {pairings
            .slice(settings.currentRound - 1, settings.currentRound)
            .map((pairings, key) => (
              <div key={key} className="mt-7">
                <MiniPairingsTable
                  format={pairings}
                  players={players}
                  results={results}
                  indexer={boards}
                  settings={settings}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="col-span-6">
        <GamesGrid />
      </div>
    </div>
  );
}

function RoundTimes({ icon, title, settings }) {
  return (
    <div className="bg-slate-900 py-4 border-2 border-cyan-600 sm:leading-none shadow-md">
      <p>
        <i className={`${icon} text-cyan-400 text-6xl`}></i>
      </p>
      <h3 className="text-white font-bold text-2xl -mb-12">{title}</h3>
      {settings.type === "Swiss" &&
        Object.entries(settings.nextRoundTime).map(([round, time], key) => (
          <div key={key} className="text-white mt-20 mb-8">
            <div className="relative justify-center">
              {/* {settings.currentRound === Number(round) && (
                <span className="absolute left-2 top-3">
                  <i className="fas fa-arrow-right text-lg text-orange-brand"></i>
                </span>
              )} */}
              <div className="font-bold text-2xl text-cyan-600">
                Round {round}
              </div>
            </div>
            <p className="text-2xl">{time}</p>
          </div>
        ))}
    </div>
  );
}

function GamesGrid() {
  const round = 1;
  return (
    <div className="bg-slate-900 border-2 border-cyan-600">
      <div className="grid grid-cols-3">
        <ChessGame round={round} board={1} />
        <ChessGame round={round} board={2} />
        <ChessGame round={round} board={1} />
        <ChessGame round={round} board={2} />
        <ChessGame round={round} board={1} />
        <ChessGame round={round} board={2} />
      </div>
    </div>
  );
}
