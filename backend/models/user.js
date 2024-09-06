const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
    },
    image: String,
    freindRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    freinds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    SendFreindRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

});

const User = mongoose.model("User", userSchema);

module.exports = User;
