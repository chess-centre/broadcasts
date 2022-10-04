import { v4 as uuidv4 } from "uuid";
import Swiss from "./Swiss";
import data from "./mata-test.json";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// const {
//   name,
//   players,
//   results,
//   settings,
//   pairings,
// } = data;

export default function SwissPresentationView() {

  const { eventId } = useParams();

  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [settings, setSettings] = useState({});
  const [pairings, setPairings] = useState([]);
  const [results, setResults] = useState([]);
  const updateState = event => {
    setPlayers(event.players);
    setSettings(event.settings);
    setPairings(event.pairings);
    setResults(event.results);
    setName(event.eventName);
  }


  useEffect(() => {

    const firstLoad = JSON.parse(window.localStorage.getItem(eventId));
    updateState(firstLoad);

    window.addEventListener('storage', () => {
      const eventInfo = JSON.parse(window.localStorage.getItem(eventId))
      console.log(eventId, eventInfo);
      updateState(eventInfo);
    });

  }, [eventId]);


  return (
    <div className="bg-slate-700 h-full grid grid-rows-1 grid-flow-col px-5 pt-4 pb-20">
      <div className="text-center">
        <div className=" bg-slate-900 py-4 relative border-2 border-cyan-600 shadow-lg rounded-lg">
          <h2 className="tracking-tight leading-10 text-cyan-500 text-5xl sm:leading-none">
            {name}
          </h2>
          <div className="tracking-tight text-slate-100 text-lg leading-none mt-3">
            Welcome to the 1st dedicated, not for profit, chess centre in the UK
          </div>
        </div>
        <div className="grid grid-cols-1 gap-10 mt-2">
          {name && players.map(({ entries, section, title, icon }, index) => {
            const result = results.find((r) => r.section === section).scores;
            return (
              <div key={uuidv4()}>
                <Swiss
                  title={title}
                  entries={entries}
                  pairings={pairings}
                  results={result}
                  settings={settings}
                  icon={icon}
                  boards={index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};