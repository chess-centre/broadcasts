import { createContext, useContext, useState } from "react";
const URL = "ws://localhost:8080";
const connection = new WebSocket(URL);
export const PGNContext = createContext(connection);

export const PGNProvider = (props) => (
  <PGNContext.Provider value={connection}>{props.children}</PGNContext.Provider>
);

export const usePGN = () => {
  const [active, setActive] = useState(false);
  const [gameState, setGameState] = useState({
    lastMove: "",
    gameResult: "",
    whiteInfo: { name: "", rating: "" },
    blackInfo: { name: "", rating: "" },
    whiteClock: "00:00:00",
    blackClock: "00:00:00",
    pgn: "",
  });

  const connection = useContext(PGNContext);

  connection.onopen = () => {
    console.log("PGN: connection open");
    setActive(true);
  };

  connection.onmessage = (response) => {
    const game = JSON.parse(response.data);

    if (game) {
      setGameState(game);
    }
  };

  const close = () => connection.close();

  return {
    active,
    gameState,
    close,
  };
};
