const categoryRoute = require("../../controllers/authControllers/categoryController");

const router = require("express").Router();

router.post("/category", categoryRoute.createCategory);
router.get("/category", categoryRoute.getCategory);

module.exports = router;
