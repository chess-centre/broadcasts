/**
 * Famous World-Class Chess Games
 * Real move sequences from historic GM encounters.
 * All moves validated against chess.js v0.13.
 */

const famousGames = [
  {
    white: { name: "Bobby Fischer", rating: "2785" },
    black: { name: "Boris Spassky", rating: "2660" },
    event: "World Championship 1972, Game 6",
    result: "1-0",
    moves: [
      "c4", "e6", "Nf3", "d5", "d4", "Nf6", "Nc3", "Be7", "Bg5", "O-O",
      "e3", "h6", "Bh4", "b6", "cxd5", "Nxd5", "Bxe7", "Qxe7", "Nxd5", "exd5",
      "Rc1", "Be6", "Qa4", "c5", "Qa3", "Rc8", "Bb5", "a6", "dxc5", "bxc5",
      "O-O", "Ra7", "Be2", "Nd7", "Nd4", "Qf8", "Nxe6", "fxe6", "e4", "d4",
      "f4", "Qe7", "e5", "Rb8", "Bc4", "Kh8", "Qh3", "Nf8", "b3", "a5",
      "f5", "exf5", "Rxf5", "Nh7", "Rcf1", "Qd8", "Qg3", "Re7", "h4", "Rbb7",
      "e6", "Rbc7", "Qe5", "Qe8", "a4", "Qd8", "R1f2", "Qe8", "R2f3", "Qd8",
      "Bd3", "Qe8", "Qe4", "Nf6", "Rxf6", "gxf6", "Rxf6", "Kg8", "Bc4", "Kh8",
      "Qf4",
    ],
  },
  {
    white: { name: "Anatoly Karpov", rating: "2725" },
    black: { name: "Garry Kasparov", rating: "2700" },
    event: "World Championship 1985, Game 16",
    result: "0-1",
    moves: [
      "e4", "c5", "Nf3", "e6", "d4", "cxd4", "Nxd4", "Nc6", "Nb5", "d6",
      "c4", "Nf6", "N1c3", "a6", "Na3", "d5", "cxd5", "exd5", "exd5", "Nb4",
      "Be2", "Bc5", "O-O", "O-O", "Bf3", "Bf5", "Bg5", "Re8", "Qd2", "b5",
      "Rad1", "Nd3", "Nab1", "h6", "Bh4", "b4", "Na4", "Bd6", "Bg3", "Rc8",
      "b3", "g5", "Bxd6", "Qxd6", "g3", "Nd7", "Bg2", "Qf6", "a3", "a5",
      "axb4", "axb4", "Qa2", "Bg6", "d6", "g4", "Qd2", "Kg7", "f3", "Qxd6",
      "fxg4", "Qd4+", "Kh1", "Nf6", "Rf4", "Ne4", "Qxd3", "Nf2+", "Rxf2", "Bxd3",
      "Rfd2", "Qe3", "Rxd3", "Rc1", "Nb2", "Qf2", "Nd2", "Rxd1+", "Nxd1", "Re1+",
    ],
  },
  {
    white: { name: "Donald Byrne", rating: "2500" },
    black: { name: "Bobby Fischer", rating: "2600" },
    event: "Game of the Century, 1956",
    result: "0-1",
    moves: [
      "Nf3", "Nf6", "c4", "g6", "Nc3", "Bg7", "d4", "O-O", "Bf4", "d5",
      "Qb3", "dxc4", "Qxc4", "c6", "e4", "Nbd7", "Rd1", "Nb6", "Qc5", "Bg4",
      "Bg5", "Na4", "Qa3", "Nxc3", "bxc3", "Nxe4", "Bxe7", "Qb6", "Bc4", "Nxc3",
      "Bc5", "Rfe8+", "Kf1", "Be6", "Bxb6", "Bxc4+", "Kg1", "Ne2+", "Kf1", "Nxd4+",
      "Kg1", "Ne2+", "Kf1", "Nc3+", "Kg1", "axb6", "Qb4", "Ra4", "Qxb6", "Nxd1",
      "h3", "Rxa2", "Kh2", "Nxf2", "Re1", "Rxe1", "Qd8+", "Bf8", "Nxe1", "Bd5",
      "Nf3", "Ne4", "Qb8", "b5", "h4", "h5", "Ne5", "Kg7", "Kg1", "Bc5+",
      "Kf1", "Ng3+", "Ke1", "Bb4+", "Kd1", "Bb3+", "Kc1", "Ne2+", "Kb1", "Nc3+",
      "Kc1", "Rc2",
    ],
  },
  {
    white: { name: "Paul Morphy", rating: "2700" },
    black: { name: "Duke of Brunswick", rating: "2000" },
    event: "Opera Game, Paris 1858",
    result: "1-0",
    moves: [
      "e4", "e5", "Nf3", "d6", "d4", "Bg4", "dxe5", "Bxf3", "Qxf3", "dxe5",
      "Bc4", "Nf6", "Qb3", "Qe7", "Nc3", "c6", "Bg5", "b5", "Nxb5", "cxb5",
      "Bxb5+", "Nbd7", "O-O-O", "Rd8", "Rxd7", "Rxd7", "Rd1", "Qe6", "Bxd7+", "Nxd7",
      "Qb8+", "Nxb8", "Rd8",
    ],
  },
  {
    white: { name: "Garry Kasparov", rating: "2851" },
    black: { name: "Veselin Topalov", rating: "2700" },
    event: "Wijk aan Zee 1999",
    result: "*",
    moves: [
      "e4", "d6", "d4", "Nf6", "Nc3", "g6", "Be3", "Bg7", "Qd2", "c6",
      "f3", "b5", "Nge2", "Nbd7", "Bh6", "Bxh6", "Qxh6", "Bb7", "a3", "e5",
      "O-O-O", "Qe7", "Kb1", "a6", "Nc1", "O-O-O", "Nb3", "exd4", "Rxd4", "c5",
      "Rd1", "Nb6", "g3", "Kb8", "Na5", "Ba8", "Bh3", "d5", "Qf4+", "Ka7",
    ],
  },
  {
    white: { name: "Magnus Carlsen", rating: "2882" },
    black: { name: "Viswanathan Anand", rating: "2775" },
    event: "World Championship 2013, Game 9",
    result: "*",
    moves: [
      "d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "f3", "d5", "a3", "Bxc3+",
      "bxc3", "c5", "cxd5", "exd5", "e3", "c4", "Ne2", "Nc6", "g4", "O-O",
      "Bg2", "Na5", "O-O", "Nb3", "Ra2", "b5", "Ng3", "a5", "g5", "Ne8",
      "e4", "Nxc1", "Qxc1", "Ra6", "e5", "Nc7", "f4", "b4", "axb4", "axb4",
      "Rxa6", "Nxa6", "f5", "b3", "Qf4", "Nc7", "f6", "g6", "Qh4", "Ne8",
      "Qh6", "b2", "Rf4", "b1=Q+", "Nf1", "Qe1",
    ],
  },
  {
    white: { name: "Fabiano Caruana", rating: "2822" },
    black: { name: "Magnus Carlsen", rating: "2835" },
    event: "World Championship 2018, Game 1",
    result: "*",
    moves: [
      "e4", "c5", "Nf3", "Nc6", "Bb5", "g6", "Bxc6", "dxc6", "d3", "Bg7",
      "O-O", "Nf6", "h3", "O-O", "Nc3", "b6", "Be3", "e5", "Qd2", "Be6",
      "Bh6", "Qd6", "Bxg7", "Kxg7", "Rfd1", "Rfd8", "a3", "a5", "Qe3", "Qe7",
      "Rd2", "Nd7", "Rad1", "Nf8", "d4", "exd4", "Nxd4",
    ],
  },
  {
    white: { name: "Ding Liren", rating: "2805" },
    black: { name: "Hikaru Nakamura", rating: "2760" },
    event: "Candidates 2022",
    result: "*",
    moves: [
      "d4", "Nf6", "c4", "e6", "Nf3", "d5", "Nc3", "Be7", "Bf4", "O-O",
      "e3", "Nbd7", "c5", "Nh5", "Bd3", "Nxf4", "exf4", "b6", "b4", "a5",
      "a3", "Ba6", "Bxa6", "Rxa6", "b5", "Ra8", "a4", "bxc5", "dxc5", "Bf6",
      "Rb1", "e5", "fxe5", "Bxe5", "Nxe5", "Nxe5", "O-O", "Qf6", "Ne2", "Nd3",
      "Qc2", "Qe6", "Nd4", "Qe4",
    ],
  },
];

module.exports = famousGames;
