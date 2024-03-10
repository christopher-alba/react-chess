import io from "socket.io-client";
import isDev from "./process";
let port = "localhost:5000";
if (!isDev()) {
  port = "https://chris-alba-react-chess-server-42e5afb0e433.herokuapp.com";
  console.log(port);
} else {
  console.log(port);
}

export const socket = io(port, { transports: ["websocket"], upgrade: false });
