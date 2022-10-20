import { generateGames } from "./ResultsChecker";
import data from "./meta-festival.json"
import gamesBlah from "./games.json";

const {
  eventName,
  date,
  eventId,
  players,
  results,
  pairings,
} = data;

const gamesOpen = generateGames(pairings[0].sectionPairings, players, results, { eventId, eventName, date }, 0);
const gamesMajor = generateGames(pairings[1].sectionPairings, players, results, { eventId, eventName, date }, 1);
const gamesIntermediate = generateGames(pairings[2].sectionPairings, players, results, { eventId, eventName, date }, 2);
const gamesMinor = generateGames(pairings[3].sectionPairings, players, results, { eventId, eventName, date }, 3);

export const gamesJson = JSON.stringify([...gamesOpen.flat(), ...gamesMajor.flat(), ...gamesIntermediate.flat(), ...gamesMinor.flat()]);

// export const gamesJson = JSON.stringify(gamesOpen.flat());

// const games = gamesOpen.flat();

// const batches = Math.ceil(games.length / 25);

// for(var i = 0; i < batches; i++) {

//   //const batch = games.slice(i, (i + 1) * 25);
//   const counter = i * 25;

//   console.log("BATCH LENGTH", counter, counter + 24);

// }

console.log(gamesBlah.length)


// 0, 19
// 20, 39
// 40, 59
// 60, 79