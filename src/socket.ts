import io from "socket.io-client";
import isDev from "./process";
let port = "localhost:5000";
if (!isDev()) {
  port = "https://react-chess-server.onrender.com";
  console.log(port);
} else {
  console.log(port);
}

export const socket = io(port, {
  transports: ["websocket"],
  upgrade: false,
  autoConnect: false,
});
