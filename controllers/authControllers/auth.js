const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        const { name, username, email, password, profile } = req.body;
        // Input validation
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required fields.",
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Please provide a valid email address.",
            });
        }

        // Email already exists validation
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "Email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            name,
            username,
            email,
            password: hashedPassword,
            profile,
        });
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(error);

        // Handle specific error cases
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

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "Invalid username or password.",
                },
            });
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "Invalid username or password.",
                },
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 60 * 60,
        });

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                username: user.username,
                email: user.email,
                profile: user.profile,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while logging in.",
        });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find();

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "No users found.",
                },
            });
        }
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "An error occurred while fetching users.",
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "User not found.",
                },
            });
        }
        const { password, ...updateData } = req.body; // '...updateData' syntax is used to spread the properties of 'req.body' into a new object called updateData.
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updateData.password = hashedPassword; // a new property 'password' is set in the 'updateData' object
        }

        const updateUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updateUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal server error.",
            },
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "User not found.",
                },
            });
        }
        // Delete the user
        await userModel.findByIdAndDelete(userId);
        res.status(200).json({
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal server error.",
            },
        });
    }
};
