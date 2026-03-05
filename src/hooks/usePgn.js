import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

const URL = "ws://localhost:8080/games";

const PGNContext = createContext(null);

/**
 * PGNProvider - owns the single shared WebSocket connection
 * and the games Map. All consumers share this connection.
 */
export const PGNProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const [games, setGames] = useState(new Map());
  const [evals, setEvals] = useState(new Map());
  const [currentRound, setCurrentRound] = useState(1);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWebSocket = () => {
    try {
      const connection = new WebSocket(URL);
      wsRef.current = connection;

      connection.onopen = () => {
        setActive(true);
        connection.send(
          JSON.stringify({ type: "subscribe_round", round: 1 }),
        );
      };

      connection.onmessage = (response) => {
        try {
          const message = JSON.parse(response.data);
          handleMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      connection.onerror = () => {
        setActive(false);
      };

      connection.onclose = () => {
        setActive(false);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  };

  const handleMessage = (message) => {
    switch (message.type) {
      case "game_update": {
        const { board, data } = message;
        setGames((prev) => {
          const next = new Map(prev);
          next.set(board, data);
          return next;
        });
        break;
      }
      case "eval_update": {
        const { board: evalBoard, evaluation, fen } = message;
        setEvals((prev) => {
          const next = new Map(prev);
          const prevEval = prev.get(evalBoard) || null;
          next.set(evalBoard, { ...evaluation, fen, prevEval });
          return next;
        });
        break;
      }
      default:
        break;
    }
  };

  const subscribeToRound = (round) => {
    setCurrentRound(round);
    setGames(new Map());
    setEvals(new Map());
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "subscribe_round", round }),
      );
    }
  };

  const value = useMemo(
    () => ({ active, games, evals, currentRound, subscribeToRound }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, games, evals, currentRound],
  );

  return <PGNContext.Provider value={value}>{children}</PGNContext.Provider>;
};

/**
 * usePGN - thin context consumer.
 * Pass boardNumber to get per-board gameState,
 * or omit to get the full games Map.
 */
export const usePGN = (boardNumber = null) => {
  const context = useContext(PGNContext);
  if (!context) {
    throw new Error("usePGN must be used within a PGNProvider");
  }

  const { active, games, evals, currentRound, subscribeToRound } = context;

  const gameState = useMemo(() => {
    if (boardNumber != null && games.has(boardNumber)) {
      return games.get(boardNumber);
    }
    return {
      lastMove: "",
      gameResult: "",
      whiteInfo: { name: "", rating: "" },
      blackInfo: { name: "", rating: "" },
      whiteClock: "00:00:00",
      blackClock: "00:00:00",
      pgn: "",
      status: "waiting",
    };
  }, [boardNumber, games]);

  const evaluation = useMemo(() => {
    if (boardNumber != null && evals.has(boardNumber)) {
      return evals.get(boardNumber);
    }
    return null;
  }, [boardNumber, evals]);

  return { active, gameState, evaluation, games, evals, currentRound, subscribeToRound };
};
