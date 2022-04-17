import { generateGames } from "../Shared/ResultsChecker";
import {
  eventName,
  date,
  eventId,
  players,
  results,
  pairings,
} from "../../components/Events/Tables/April/meta.json";

const games = generateGames(pairings, players, results, { eventId, eventName, date });

export const gamesJson = JSON.stringify(games.flat()); 