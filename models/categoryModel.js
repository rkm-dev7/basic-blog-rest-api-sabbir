const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;
