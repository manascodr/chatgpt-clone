import { Server } from "socket.io";

function initScoketServer(httpServer) {
    const io = new Server(httpServer, {})

    io.on("connection", (socket)=>{
        console.log("New client connected", socket.id);
    })
}

export { initScoketServer };