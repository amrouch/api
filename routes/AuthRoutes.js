const express = require('express');
const authController = require('../controllers/AuthController');

const router = express.Router();

//register
router.post("/register", authController.register)

//login
router.post("/login", authController.login)

module.exports = router;