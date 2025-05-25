// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Lấy thông tin người dùng hiện tại
router.get('/me', verifyToken, getMe);

module.exports = router;
