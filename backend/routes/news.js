const express = require('express');
const router = express.Router();
const New = require('../models/New');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Đảm bảo có dòng này để sử dụng fs

// Cấu hình Multer cho việc upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'news');
        // Tùy chọn: Đảm bảo thư mục tồn tại (có thể dùng fs-extra như gợi ý trước)
        // Nếu không, Multer sẽ báo lỗi nếu thư mục không tồn tại
        fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa có
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Chỉ cho phép tải lên file ảnh (jpeg, jpg, png, gif)!'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

// Tạo bài viết (chỉ admin)
router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        let imageUrl = null;

        if (req.file) {
            imageUrl = `/uploads/news/${req.file.filename}`;
        }

        const newNew = new New({ title, content, imageUrl });
        await newNew.save();
        res.status(201).json({ message: 'Bài viết đã được tạo thành công!', post: newNew });
    } catch (err) {
        console.error('Lỗi server khi tạo bài viết:', err);
        // Cải thiện thông báo lỗi
        res.status(500).json({ message: err.message || 'Lỗi server khi tạo bài viết.' });
    }
});

// Lấy một bài viết cụ thể theo ID
router.get('/:id', async (req, res) => {
    try {
        const newsId = req.params.id;
        const newsItem = await New.findById(newsId);

        if (!newsItem) {
            return res.status(404).json({ message: 'Bài viết không tìm thấy.' });
        }
        res.json(newsItem);
    } catch (err) {
        console.error('Lỗi server khi lấy bài viết theo ID:', err);
        // Nếu ID không hợp lệ (ví dụ: định dạng sai), Mongoose sẽ ném lỗi CastError
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'ID bài viết không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi server khi lấy bài viết.' });
    }
});



// Lấy danh sách tất cả bài viết
router.get('/', async (req, res) => {
    try {
        const news = await New.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (err) {
        console.error('Lỗi server khi lấy bài viết:', err);
        res.status(500).json({ message: 'Không thể lấy bài viết' });
    }
});


// Xóa bài viết (chỉ admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const newsId = req.params.id;
        const deletedNews = await New.findByIdAndDelete(newsId);

        if (!deletedNews) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }

        // Tùy chọn: Xóa file ảnh liên quan khỏi server nếu có
        if (deletedNews.imageUrl) {
            const imagePath = path.join(__dirname, '..', 'public', deletedNews.imageUrl);
            // Kiểm tra xem file có tồn tại không trước khi xóa
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Lỗi khi xóa file ảnh:', err);
                    else console.log(`Đã xóa file ảnh: ${imagePath}`);
                });
            }
        }

        res.json({ message: 'Bài viết đã được xóa thành công!' });
    } catch (err) {
        console.error('Lỗi server khi xóa bài viết:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'ID bài viết không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi server khi xóa bài viết' });
    }
});

// TODO: Implement update route (PUT /api/news/:id) with image handling (nếu bạn muốn admin có thể sửa bài viết)

module.exports = router;