import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://chat-app-td6w.onrender.com", {
  path: "/api/socket.io",
});

function Socket() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
  }, [socket]);
}

export { socket };
export default Socket;
