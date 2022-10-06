import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Update() {
  const { eventId } = useParams();

  const [eventJson, setEvent] = useState({
    pairings: [],
    players: [],
    results: [],
  });

  useEffect(() => {
    if (eventId) {
      const eventInfo = window.localStorage.getItem(eventId);
      if (eventInfo) {
        setEvent(JSON.parse(eventInfo));
      }
    }
  }, [eventId]);

  return (
    <div className="md:grid md:grid-cols-1 md:gap-6 text-white m-20">
      <div className="mx-20">
        {eventJson && eventJson.eventId && (
          <>
            <h1>Pairings</h1>
            <div>
              <PairingTable
                eventId={eventId}
                rounds={eventJson.pairings}
                players={eventJson.players[0].entries}
                scores={eventJson.results[0].scores}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PairingTable({ eventId, rounds, players, scores }) {
  const getPlayer = (id) => {
    return players.find((p) => p.seed === id);
  };

  return (
    <div className="shadow-lg rounded-md">
      <table className="min-w-full">
        <thead className="bg-white text-center">
          <tr>
            <th
              scope="col"
              className="px-1 py-1 text-center text-sm font-semibold text-gray-900 sm:pl-6"
            >
              White
            </th>
            <th
              scope="col"
              className="px-1 py-1 text-center text-sm font-semibold text-gray-900"
            >
              Rating
            </th>
            <th
              scope="col"
              className="px-1 py-1 text-center text-sm font-semibold text-gray-900"
            >
              vs
            </th>
            <th
              scope="col"
              className="px-1 py-1 text-center text-sm font-semibold text-gray-900"
            >
              Rating
            </th>
            <th
              scope="col"
              className="px-1 py-1 text-center text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Black
            </th>
          </tr>
        </thead>
        <tbody className="bg-white text-center">
          {rounds.map((round) => {
            const roundNumber = round.round;
            return (
              <Fragment key={round.round}>
                <tr className="border-t border-gray-200">
                  <th
                    colSpan={5}
                    scope="colgroup"
                    className="bg-gray-50 px-1 py-1 text-center text-sm font-semibold text-gray-900 sm:px-6"
                  >
                    Round {round.round}
                  </th>
                </tr>
                {round.pairings
                  .filter((pairing) => !!pairing[0] && !!pairing[1])
                  .map((pairing, pairingIdx) => {
                    const boardNumber = pairingIdx + 1;
                    const white = getPlayer(pairing[0]);
                    const black = getPlayer(pairing[1]);

                    return (
                      <tr
                        key={pairingIdx}
                        className={classNames(
                          pairingIdx === 0
                            ? "border-gray-300"
                            : "border-gray-200",
                          "border-t"
                        )}
                      >
                        <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">
                          {white.name}
                        </td>
                        <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">
                          {white.ratingInfo.rating}
                        </td>
                        <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">
                          <PairingResult
                            eventId={eventId}
                            round={roundNumber}
                            board={boardNumber}
                            scores={scores}
                          />
                        </td>
                        <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">
                          {black.ratingInfo.rating}
                        </td>
                        <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">
                          {black.name}
                        </td>
                      </tr>
                    );
                  })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PairingResult({ eventId, round, board, scores }) {
  const updateResult = (result) => {
    console.log("updating result", result, "round", round, "board", board);
    const eventInfo = window.localStorage.getItem(eventId);
    if (eventInfo) {
      const ev = { ...JSON.parse(eventInfo) };

      const pairingIndex = ev.results[0].scores.findIndex(
        (s) => s.round === round
      );
      console.log("pairingIndex", pairingIndex);

      if (pairingIndex !== -1) {
        console.log("pairingIdx", pairingIndex);
        ev.results[0].scores[pairingIndex].pairResults[board - 1] = result;

        window.localStorage.setItem(eventId, JSON.stringify(ev));
      }
    }
  };

  const handleSelectChange = (event) => {
    console.log("handling selected change");
    updateResult(JSON.parse(event.target.value));
  };

  return (
    <div className="w-36 text-center mx-auto">
      <select
        id={`${eventId}-${round}-${board}`}
        onChange={handleSelectChange}
        name="result"
        className="mt-1 block w-full text-center rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
        defaultValue={scores[round - 1].pairResults[board - 1]}
      >
        <option value="[1,0]">1 - 0</option>
        <option value="[0.5,0.5]">½ - ½</option>
        <option value="[0,1]">0 - 1</option>
        <option value="[1,0]">+ - -</option>
        <option value="[0,1]">- - +</option>
        <option value="[]">In Progress</option>
        <option value="[]"></option>
      </select>
    </div>
  );
}
