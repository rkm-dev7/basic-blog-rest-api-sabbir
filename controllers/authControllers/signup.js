const userModel = require("../../models/userModel");

exports.signup = async (req, res) => {
    const { name, username, email, password, profile } = req.body;
    try {
        const user = await userModel.create({
            name,
            username,
            email,
            password,
            profile,
        });
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred during signup.";
        if (error.code === 11000) {
            errorMessage = "Username or email already exists.";
        } else if (error.name === "ValidationError") {
            errorMessage = Object.values(error.errors).map(
                (error) => error.message
            );
        }
        res.status(401).json({
            success: false,
            error: errorMessage,
        });
    }
};
