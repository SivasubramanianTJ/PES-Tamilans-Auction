import dotenv from "dotenv";
import http from "http";

import app from "./app";
import { initializeSocket } from "./socket";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log("====================================");
  console.log("🚀 PES Tamilans Auction API");
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  console.log("⚡ Socket.IO initialized");
  console.log("====================================");
});