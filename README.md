# The Chess Centre

## DGT Board Presentation

This is a work-in-progress project to provide a much more integrated experience with the chess centre website and the player data, including tournament history.

<img src="./img/example.png" />


### Getting started

This project has two key components:

1. UI - React Application for displaying the Chess data

```$ npm start```

1. Backend - Node server to monitor pgn file changes produced by the `DGT LiveChess` application

```$ npm run server```


### DGT

The initial intention _was_ to use the LiveChess WebSocket API to list for move changes and directly stream these to a `Chessboard` component using the `chess.js` methods `.fen()` or `.load_pgn()`. This could then be abstracted into a clean React custom hook, something like:

```
const { moves, clockTimes, playerInfo } = useDGT();
```

This would be an ideal API for building a UI component which is focused purely on move display and game information. 

Unfortunately, this is far from easy to achieve after reading the documentation is being unable to attain the necessary data from the `feed` socket subscription. Therefore a file reader interm solution is currently in use, this includes an interval to `fetch` (poll) for pgn updates 🤢

### NEXT STEPS

The most logical next steps here include:

1. Adding a Server Side websocket connection for pushing file change updates to the client
2. Adding the Client Side websocket connection for specific game changes (one or multiple websocket connections?)
3. Adding move square indication to the `lastMove` of the game (again, not easy to do!)
4. Determining if the LiveChess Website API can be used as a stable solution for moves (initial efforts suggest not)
5. Document approach, and make reusable for other consumers.
