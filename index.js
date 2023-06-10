require("dotenv").config();
const express = require("express");
const connectDatabase = require("./config/connectDatabase");
const signupRoute = require("./routes/auth/signupRoute");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/signup", signupRoute);

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    connectDatabase();
});
