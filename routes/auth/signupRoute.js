const { signup } = require("../../controllers/authControllers/signup");

const signupRoute = require("express").Router();

signupRoute.post("/", signup);

module.exports = signupRoute;
