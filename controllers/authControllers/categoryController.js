const categoryModel = require("../../models/categoryModel");
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // Validate inputs
        if (!name) {
            return res.status(400).json({
                success: false,
                error: "Name is required.",
            });
        }

        const category = await categoryModel.create({
            name,
        });

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error(error);

        // Handle specific error cases
        if (error.name === "ValidationError") {
            const errorMessages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({
                success: false,
                error: errorMessages,
            });
        }

        // Generic error handling
        res.status(500).json({
            success: false,
            error: "An error occurred while creating the category.",
        });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find();

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No categories found.",
            });
        }

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error("An error occurred while fetching categories:", error);

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(
                (err) => err.message
            );

            return res.status(400).json({
                success: false,
                error: validationErrors,
            });
        }

        res.status(500).json({
            success: false,
            error: "An error occurred while fetching categories. Please try again later.",
        });
    }
};
