import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import { initScoketServer } from "./src/sockets/socket.server.js";
import http from "http"; // <-- fix import name

dotenv.config();
connectDB();

const server = http.createServer(app); // <-- fix variable name

initScoketServer(server);

server.listen(3000, () => { // <-- start the HTTP server
  console.log("Server is running on port 3000");
});