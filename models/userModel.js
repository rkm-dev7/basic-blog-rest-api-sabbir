const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        profile: {
            type: String,
            default: "avater.png",
        },
    },
    { timestamps: true, versionKey: false }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
