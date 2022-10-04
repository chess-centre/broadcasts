import { useEffect, useState, Fragment } from "react";
import { useHistory, useParams } from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Update() {

    const { eventId } = useParams();

    const [eventJson, setEvent] = useState({
        pairings: [],
        players: [],
        results: []
    });

    useEffect(() => {
        if (eventId) {
            const eventInfo = window.localStorage.getItem(eventId);
            if (eventInfo) {
                setEvent(JSON.parse(eventInfo));
            }
        }
    }, []);
    //
    return (
        <div className="md:grid md:grid-cols-1 md:gap-6 text-white m-20">
            <div className="mx-20">
                {eventJson && eventJson.eventId && (<>
                    <h1>Pairings</h1>
                    <div>
                        <PairingTable rounds={eventJson.pairings} players={eventJson.players[0].entries} />
                    </div>

                </>)}
            </div>
        </div>
    );
}


function PairingTable({ rounds, players }) {

    const getPlayer = (id) => {
        return players.find(p => p.seed === id);
    }

    return (
        <div className="shadow-lg rounded-md"><table className="min-w-full">
            <thead className="bg-white text-center">
                <tr>
                    <th scope="col" className="px-1 py-1 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                        White
                    </th>
                    <th scope="col" className="px-1 py-1 text-center text-sm font-semibold text-gray-900">
                        Rating
                    </th>
                    <th scope="col" className="px-1 py-1 text-center text-sm font-semibold text-gray-900">
                        vs
                    </th>
                    <th scope="col" className="px-1 py-1 text-center text-sm font-semibold text-gray-900">
                        Rating
                    </th>
                    <th scope="col" className="px-1 py-1 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                        Black
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white text-center">
                {rounds.map((round) => (
                    <Fragment key={rounds.round}>
                        <tr className="border-t border-gray-200">
                            <th
                                colSpan={5}
                                scope="colgroup"
                                className="bg-gray-50 px-1 py-1 text-center text-sm font-semibold text-gray-900 sm:px-6"
                            >
                                Round {round.round}
                            </th>
                        </tr>
                        {round.pairings.map((pairing, pairingIdx) => {

                            const white = getPlayer(pairing[0]);
                            const black = getPlayer(pairing[1]);

                            return (
                                <tr
                                    key={pairingIdx}
                                    className={classNames(pairingIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                                >
                                    <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">{white.name}</td>
                                    <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">{white.ratingInfo.rating}</td>
                                    <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500"><PairingResult id={`${white.memberId}--${black.memberId}`} /></td>
                                    <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">{black.ratingInfo.rating}</td>
                                    <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">{black.name}</td>
                                </tr>
                            )
                        })}
                    </Fragment>
                ))}
            </tbody>
        </table>
        </div>)
}


function PairingResult({ id }) {
    return (
        <div className="w-36 text-center mx-auto">
            <select
                id={id}
                name="result"
                className="mt-1 block w-full text-center rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                defaultValue=""
            >
                <option>1 - 0</option>
                <option>½ - ½</option>
                <option>0 - 1</option>
                <option>+ - -</option>
                <option>- - +</option>
                <option>In Progress</option>
                <option></option>
            </select>
        </div>
    )
}
