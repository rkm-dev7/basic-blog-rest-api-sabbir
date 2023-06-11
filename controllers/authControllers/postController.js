const postModel = require("../../models/postModel");
exports.createPost = async (req, res) => {
    try {
        const { title, body, username, category, photo } = req.body;

        // Validate the input data
        if (!title || !body || !username || !category || !photo) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required fields.",
            });
        }

        const post = await postModel.create({
            title,
            body,
            username,
            category,
            photo,
        });

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = "An error occurred while creating the post.";

        if (error.name === "ValidationError") {
            errorMessage = Object.values(error.errors).map(
                (error) => error.message
            );
        }

        res.status(400).json({
            success: false,
            error: errorMessage,
        });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const { username, category } = req.query;
        let posts;
        if (username) {
            posts = await postModel.find({ username });
        } else if (category) {
            posts = await postModel.find({ category: { $in: [category] } });
        } else {
            posts = await postModel.find();
        }

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.error(error);

        if (error.name === "ValidationError") {
            const errorMessages = Object.values(error.errors).map(
                (err) => err.message
            );

            res.status(400).json({
                success: false,
                error: errorMessages,
            });
        } else {
            res.status(500).json({
                success: false,
                error: "An error occurred while retrieving posts.",
            });
        }
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "Post not found.",
                },
            });
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            data: updatedPost,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = "An error occurred while updating the post.";

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                error: "Invalid post ID.",
            });
        }

        if (error.name === "ValidationError") {
            errorMessage = Object.values(error.errors).map(
                (error) => error.message
            );
            return res.status(400).json({
                success: false,
                error: errorMessage,
            });
        }

        res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        // Check if the post exists
        const post = await postModel.findById(postId);
        if (!post) {
            res.status(404).json({
                success: false,
                error: "Post not found.",
            });
        }
        // Delete the post
        const deletedPost = await postModel.findByIdAndDelete(postId);

        res.status(200).json({
            success: true,
            data: deletedPost,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = "An error occurred while deleting the post.";

        if (error.name === "CastError" && error.kind === "ObjectId") {
            errorMessage = "Invalid post ID.";
            return res.status(400).json({
                success: false,
                error: errorMessage,
            });
        }

        res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
};

exports.getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            res.status(404).json({
                success: false,
                error: {
                    message: "No post found.",
                },
            });
        }
        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error("Error in getPost:", error);
        let errorMessage = "An error occurred while retrieving the post.";
        let statusCode = 500;

        if (error.name === "CastError" && error.kind === "ObjectId") {
            errorMessage = "Invalid post ID.";
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
        });
    }
};
