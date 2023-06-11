const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res
                .status(403)
                .send("A token is required for authentication");
        }
        const sToken = token.split(" ")[1];
        const decode = jwt.verify(sToken, process.env.SECRET_KEY);
        const id = decode.id;
        const user = await userModel.findById(id);
        req.user = user;

        next();
    } catch (error) {
        console.error(error);

        if (error.name === "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        } else if (error.name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                error: "Token expired",
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    }
};
