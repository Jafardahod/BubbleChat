
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'audio', 'video', 'application'],
    },
    message: String,
    FileUrl: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;