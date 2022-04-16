import { createContext, useContext, useState } from "react";
const LiveChessAPIURL = "ws://127.0.0.1:1982/api/v1.0";

const IDS = {
  serials: 888, // arbitary value
};

const METHODS = {
  subscription: (id, feedId, serial) => JSON.stringify({
    call: "subscribe",
    id,
    param: {
      feed: "liveviewer",
      id: feedId,
      param: {
        serialnr: serial,
      },
    },
  }),
  eboards: (id) => JSON.stringify({
    call: "eboards",
    id,
    param: null,
  }),
  call: (fen, id) => JSON.stringify({
    id,
    call: "call",
    param: {
      id,
      method: "setup",
      param: {
        fen,
      },
    },
  }),
};

const connection = new WebSocket(LiveChessAPIURL);
export const DGTContext = createContext(connection);

export const DGTProvider = (props) => (
  <DGTContext.Provider value={connection}>{props.children}</DGTContext.Provider>
);

export const useDGT = () => {
  const [active, setActive] = useState(false);
  const [lastMove, setLastMove] = useState("");
  const connection = useContext(DGTContext);

  connection.onopen = () => {
    console.log("DGT: connection open");
    setActive(true);
    // GET LIST OF CONNECT DGT SERIAL PORTS:
    connection.send(METHODS.eboards(IDS.serials));
  };

  connection.onerror = (error) => {
    console.error("DGT: connection error");
  };

  connection.onmessage = (response) => {
    const message = JSON.parse(response.data);
    console.log("DGT: message received", message);

    if (message.id === IDS.serials) {
      message.param.forEach(({ serialnr }, index) => {
        if (serialnr) {
          const subscription = METHODS.subscription(index + 1, index + 1, serialnr);
          connection.send(subscription);
        }
      });
    }
    if(message.response === "feed") {
      setLastMove(message.param);
    }
  };

  const close = () => {
    setActive(false);
    connection.close();
  };

  return {
    active,
    lastMove,
    close,
  };
};
