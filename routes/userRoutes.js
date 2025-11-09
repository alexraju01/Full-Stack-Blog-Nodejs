const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signUp);

router.route("/").get(userController.getAllUsers);
router.route("/:id").delete(userController.deleteUser);

module.exports = router;
