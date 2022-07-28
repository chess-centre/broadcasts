import { generateGames } from "../Shared/ResultsChecker";
import data from "./meta.json"
const {
  eventName,
  date,
  eventId,
  players,
  results,
  pairings,
} = data;

const gamesOne = generateGames(pairings, players, results, { eventId, eventName, date }, 0);
const gamesTwo = generateGames(pairings, players, results, { eventId, eventName, date }, 1);
const gamesThree = generateGames(pairings, players, results, { eventId, eventName, date }, 2);

export const gamesJson = JSON.stringify([gamesOne.flat(), gamesTwo.flat(), gamesThree.flat()]); 

