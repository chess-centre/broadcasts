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

const games = generateGames(pairings, players, results, { eventId, eventName, date });

export const gamesJson = JSON.stringify(games.flat()); 
