import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { generateResponse } from "../services/ai.service.js";
import messageModel from "./../models/message.model.js";

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers?.cookie || ""; // get cookie string or empty
    const cookies = cookie.parse(cookieHeader); // parse cookies

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided")); // handle missing token error
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      socket.user = user; // attach user to socket

      //   socket.user = decoded; // attach decoded token info to socket

      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token")); // handle invalid token error
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("ai-message", async (messagePayload) => {
      // messagePayload given by client
      console.log(messagePayload); //messagePayload:  { chat: chatId, content: "User message" }

      await messageModel.create({
        chat: messagePayload.chat, // chatId from payload
        user: socket.user._id, // userId from authenticated socket
        content: messagePayload.content, // user message content
        role: "user",
      });

      const chatHistory = (await messageModel.find({
        chat: messagePayload.chat,
      }).sort({ createdAt: -1 }).limit(4).lean()).reverse(); // get last 4 messages in chronological order

      // Generate AI response based on user message
      const response = await generateResponse(
        chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],// Gemini API expects content in parts array
          };
        })
      ); // get AI response text

      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      socket.emit("ai-response", {
        // emit AI response back to client
        content: response,
        chat: messagePayload.chat, // echo back chatId for client to associate
      });
    });
  });
}

export { initSocketServer };
