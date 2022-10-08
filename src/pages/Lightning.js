import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const START_DELAY = 5;
const CONTINUED_DELAY = 10;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Lightning() {
  const navigate = useNavigate();
  const delay = useRef(START_DELAY);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(1);
  const [tableRows, setTableRows] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const play = () => {
      try {
        audioRef.current.play();
      } catch (error) {
        console.log(error);
      }
    };

    let interval = null;

    if (time === 11) {
      delay.current = CONTINUED_DELAY;
    }

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        play();
        if (time % 2 !== 0) {
          setTableRows((rows) => {
            return [...rows, { move: time, white: true, black: false }];
          });
        } else {
          setTableRows((rows) => {
            const idx = rows.findIndex(({ move }) => move === time - 1);
            rows[idx].white = true;
            rows[idx].black = true;
            return [...rows];
          });
        }
        setTime((time) => time + 1);
      }, delay.current * 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, delay, time, audioRef]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(1);
    setTableRows([]);
    delay.current = START_DELAY;
  };

  return (
    <div className="flex flex-col h-screen justify-between text-white">
      <div className="mx-auto sm:max-w-2xl text-center mt-10 ">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">Lightning <span><i className="fas fa-bolt text-yellow-400"></i></span> Chess</h1>
        {!isActive && isPaused && (
          <button
            type="button"
            onClick={(e) => handleStart(e)}
            className="inline-flex text-2xl items-center rounded-full border border-transparent bg-pink-600 p-10 text-white shadow-sm hover:bg-pink-700"
          >
            <i className="fas fa-play"></i>
          </button>
        )}

        {isActive && !isPaused && (
          <button
            type="button"
            onClick={() => handlePauseResume()}
            className="inline-flex text-2xl items-center rounded-full border border-transparent bg-pink-600 p-10 text-white shadow-sm hover:bg-pink-700"
          >
            <i className="fas fa-pause"></i>
          </button>
        )}

        {isActive && isPaused && (
          <button
            type="button"
            onClick={() => handleReset()}
            className="inline-flex text-2xl items-center rounded-full border border-transparent bg-pink-600 p-10 text-white shadow-sm hover:bg-pink-700"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        )}
        <p className="text-sm font-medium mt-4">
          Delay <span className="text-pink-600 text-2xl">{delay.current}</span>{" "}
          seconds
        </p>
        <div className="grid grid-cols-2 sm:mx-10 text-center mt-6 gap-5">
          {time % 2 !== 0 ? (
            <ToMove color="white" text="White to move" />
          ) : (
            <NotToMove color="white" text="Panicking..." />
          )}
          {time % 2 === 0 ? (
            <ToMove color="black" text="Black to move" />
          ) : (
            <NotToMove color="black" text="Panicking..." />
          )}
        </div>
        <div className="mt-8 mx-2 overflow-y-auto rounded-md">
          <TableOfMoves rows={tableRows} />
        </div>
      </div>{" "}
      <div className="text-center mx-auto">
        <p className="text-sm font-medium text-white mb-2">Test Beep</p>
        <audio controls autoPlay ref={audioRef}>
          <source
            src="https://audio-files-broadcast-app.s3.eu-west-1.amazonaws.com/beep-test.mp3"
            crossOrigin="anonymous"
          ></source>
        </audio>
      </div>
      <div className="relative">
        <div className=" text-white justify-center text-center mb-4">
          <p className="text-xs text-gray-500 font-medium">Powered by</p>
          <div>
            <img
              className="h-10 object-center mx-auto"
              src={Logo}
              onClick={() => navigate("/")}
              alt="The Chess Centre"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToMove({ color, text }) {
  const white = "text-white bg-cyan-600";
  const black = "text-black bg-pink-600";
  return (
    <div
      className={classNames(
        color === "white" ? white : black,
        "text-6xl sm:text-9xl rounded-lg m-2 p-4 sm:m-6 sm:p-10"
      )}
    >
      <i className="fas fa-chess-king-alt"></i>
      <p className="text-base sm:text-2xl tracking-tight">{text}</p>
    </div>
  );
}

function NotToMove({ color, text }) {
  const white = "text-slate-800";
  const black = "text-slate-800";
  return (
    <div
      className={classNames(
        color === "white" ? white : black,
        "text-6xl sm:text-9xl rounded-lg m-2 p-4 sm:m-6 sm:p-10 text-"
      )}
    >
      <i className="fas fa-chess-king-alt"></i>
      <p className="text-base sm:text-2xl">{text}</p>
    </div>
  );
}

function TableOfMoves({ rows }) {
  return (
    <table className="min-w-full">
      <thead className="bg-cyan-600 border-0 border-white">
        <tr>
          <th className="py-1 text-center text-sm font-semibold text-gray-900 border-0 border-white">
            Moves
          </th>
          <th className="px-1 py-1 text-center  text-sm font-semibold text-gray-900 border-0 border-white">
            White
          </th>
          <th className="px-1 py-1 text-center text-sm font-semibold text-gray-900 border-0 border-white">
            Black
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {Boolean(rows.length) &&
          rows
            .map((row, key) => (
              <tr key={key}>
                <td className="px-1 py-1 text-sm text-pink-600 font-normal">
                  {key + 1}
                </td>
                <td
                  className={classNames(
                    row.white && "bg-slate-200",
                    "px-1 py-1 text-sm text-gray-50 border-0 border-white"
                  )}
                >
                  {row.white && (
                    <span className="text-green-600">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                </td>
                <td
                  className={classNames(
                    row.black && "bg-slate-200",
                    "px-1 py-1 text-sm text-gray-50 border-0 border-white"
                  )}
                >
                  {row.black && (
                    <span className="text-green-600">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                </td>
              </tr>
            ))
            .slice(
              rows.length > 6 ? rows.length - 7 : 0,
              rows.length > 6 ? rows.length - 1 : 6
            )}
      </tbody>
    </table>
  );
}

export default Lightning;
