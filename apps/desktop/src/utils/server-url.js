const SERVER_URL =
  process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

export const getServerURL = () => SERVER_URL;

export const getWebSocketURL = () => {
  const http = getServerURL();
  const ws = http.replace(/^http/, "ws");
  return `${ws}/games`;
};
