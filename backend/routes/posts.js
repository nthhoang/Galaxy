// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment'); // <-- THÊM DÒNG NÀY
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình Multer để lưu trữ ảnh/video
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ĐIỀU CHỈNH ĐƯỜNG DẪN ĐÍCH: public/uploads/posts
        const uploadPath = path.join(__dirname, '../public', 'uploads', 'posts');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Thêm recursive: true để tạo thư mục cha nếu chưa có
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|ogg/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif) hoặc video (mp4, webm, ogg)!'));
    }
}).array('media', 3); // Chấp nhận tối đa 3 file với tên trường 'media'

// Tạo bài viết cộng đồng (người dùng đã đăng nhập, có thể kèm ảnh/video)
router.post('/', verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err.message);
            return res.status(400).json({ message: err.message });
        }

        try {
            const { title, content } = req.body;
            // ĐIỀU CHỈNH URL TRẢ VỀ CHO FRONTEND: /uploads/posts/
            const mediaUrls = req.files ? req.files.map(file => `/uploads/posts/${file.filename}`) : [];

            if (!content && mediaUrls.length === 0) {
                return res.status(400).json({ message: 'Nội dung hoặc ảnh/video không được để trống.' });
            }

            const newPost = new Post({
                title,
                content,
                author: req.user.id, // Gắn user từ token
                mediaUrls // Lưu các URL của media
            });
            await newPost.save();
            res.status(201).json({ message: 'Bài viết đã được đăng' });
        } catch (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ message: 'Lỗi server khi đăng bài' });
        }
    });
});

// Lấy danh sách bài viết cộng đồng (bao gồm thông tin tác giả, lượt thích và số bình luận)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username avatar') // <-- SỬA DÒNG NÀY: THÊM 'avatar'
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất

        // ... (phần xử lý commentCount như cũ)

        const postsWithCommentCount = await Promise.all(posts.map(async post => {
            const commentCount = await Comment.countDocuments({ postId: post._id });
            return { ...post.toObject(), commentCount };
        }));

        res.json(postsWithCommentCount);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Không thể tải bài viết' });
    }
});

// Endpoint để xử lý Like/Unlike bài viết
router.post('/:postId/like', verifyToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id; // User ID từ token

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại.' });
        }

        const index = post.likes.indexOf(userId);
        if (index > -1) {
            // Đã thích, bỏ thích
            post.likes.splice(index, 1);
            await post.save();
            res.json({ message: 'Đã bỏ thích bài viết.', liked: false });
        } else {
            // Chưa thích, thêm thích
            post.likes.push(userId);
            await post.save();
            res.json({ message: 'Đã thích bài viết.', liked: true });
        }
    } catch (err) {
        console.error('Error toggling like:', err);
        res.status(500).json({ message: 'Lỗi server khi xử lý lượt thích.' });
    }
});

module.exports = router;