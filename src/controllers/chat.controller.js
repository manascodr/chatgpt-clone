import chatModel from "../models/chat.model.js";

async function createChat(req, res) {
    const { title } = req.body;
    const user = req.user;

    const chat = new chatModel({
        user: user._id,
        title,
    });

    res.status(201).json({ message: "Chat created", chat:{
        id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
    } });
}

export { createChat };