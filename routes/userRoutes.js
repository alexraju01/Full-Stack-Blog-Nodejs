const express = require("express");
const router = express.Router();
const authContoller = require("../controllers/authController");

router.post("/signup", authContoller.signUp);

module.exports = router;
