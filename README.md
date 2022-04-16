# The Chess Centre

## DGT Board Presentation

This is a work-in-progress project to provide a much more integrated experience with the chess centre website and the player data, including tournament history.

<img src="./img/example.png" />


### Getting started

This project has two key components:

1. UI - React Application for displaying the Chess Data

```$ npm start```

2. Backend - Node Server to monitor pgn file changes produced by the LiveChess Viewer application

```$ npm run server```


### DGT

The initial intension was to entirely use the LiveChess WebSocket API to list for move changes and directly send these to the `chessboard` component, hand wrap this entire client websocket connect in a React custom hook ie.

```
const { moves, clockTimes, playerInfo } = useDGT();
```

This being an ideal API interface for building a clean React Component for displaying the chess position.

Unfortunately, this is far from easy to achieve. So a file reader intermit solution is currently in use, including an interval `fetch` to poll for pgn updates 🤢

### NEXT STEPS

The most logical next steps here include:

1. Adding a Server Side websocket connection for pushing file change updates to the client
2. Adding the Client Side websocket connection for specific game changes (one or multiple websocket connections?)
3. Adding move square indication to the `lastMove` of the game (again, not easy to do!)
4. Determining if the LiveChess Website API can be used as a stable solution for moves (initial efforts suggest not)
5. Document approach, and make reusable for other consumers.
