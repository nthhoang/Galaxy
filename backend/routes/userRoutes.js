// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình Multer để lưu trữ ảnh đại diện
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads/avatars');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `avatar-${req.user.id}${ext}`; // DÒNG NÀY ĐÃ ĐƯỢC SỬA!
    console.log('Multer is trying to save file with name:', filename);
    console.log('User ID:', req.user.id);
    cb(null, filename);
}
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh JPG, JPEG, PNG, GIF!'));
    }
});


// API lấy thông tin người dùng đã đăng nhập
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tìm thấy.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng.' });
    }
});

// API cập nhật thông tin người dùng (username, email)
router.put('/profile', verifyToken, async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tìm thấy.' });
        }

        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Tên người dùng đã tồn tại.' });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Email đã tồn tại.' });
            }
            user.email = email;
        }

        await user.save();
        res.json({ message: 'Cập nhật thông tin thành công.', user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin.' });
    }
});

// API upload hoặc thay đổi ảnh đại diện
router.post('/profile/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn ảnh để tải lên.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tìm thấy.' });
        }

        // BỎ HOÀN TOÀN KHỐI LOGIC XÓA ẢNH CŨ NÀY
        // Multer đã được cấu hình để đặt tên file là `avatar-${req.user.id}${ext}`,
        // nên nó sẽ tự động ghi đè lên file cũ của cùng người dùng.
        /*
        if (user.avatar) {
            const oldFilename = path.basename(user.avatar);
            const oldAvatarPath = path.join(__dirname, '../public/uploads/avatars', oldFilename);

            if (fs.existsSync(oldAvatarPath) && oldFilename.startsWith(`avatar-${req.user.id}`)) {
                fs.unlink(oldAvatarPath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error("Lỗi khi xóa ảnh cũ:", err);
                    }
                });
            }
        }
        */

        // Lưu đường dẫn ảnh mới vào database
        user.avatar = `/uploads/avatars/${req.file.filename}`; // URL này sẽ được dùng ở frontend
        await user.save();

        res.json({ message: 'Ảnh đại diện đã được cập nhật.', avatar: user.avatar });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server khi tải ảnh đại diện.' });
    }
});

module.exports = router;