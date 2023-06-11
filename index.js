require("dotenv").config();
const express = require("express");
const connectDatabase = require("./config/connectDatabase");
const authRoute = require("./routes/auth/authRoute");
const postRoute = require("./routes/auth/postRoute");
const categoryRoute = require("./routes/auth/categoryRoute");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", categoryRoute);

// Middleware for handling 404 errors
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    connectDatabase();
});
