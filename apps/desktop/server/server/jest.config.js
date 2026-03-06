module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  transformIgnorePatterns: [
    "/node_modules/(?!(chess\\.js|@mliebelt/pgn-parser)/)",
  ],
  transform: {
    "\\.[jt]sx?$": [
      "babel-jest",
      { presets: ["babel-preset-react-app/test"] },
    ],
  },
};
