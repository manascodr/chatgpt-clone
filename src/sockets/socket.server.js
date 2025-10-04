import { Server } from "socket.io";

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {})

    io.on("connection", (socket)=>{
        console.log("New client connected", socket.id);
    })

    return io;
}

export { initSocketServer };