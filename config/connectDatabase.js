const mongoose = require("mongoose");

const connectionDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST);
        console.log("Database connected!");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectionDatabase;
