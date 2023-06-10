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
        res.status(401).json({
            success: false,
            error: "Server Error",
        });
    }
};
