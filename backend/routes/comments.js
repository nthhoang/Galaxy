// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post'); // Cần để cập nhật comment count (tùy chọn)
const { verifyToken } = require('../middleware/auth');

// Đăng bình luận cho một bài viết
router.post('/:postId', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const userId = req.user.id;

        if (!content.trim()) {
            return res.status(400).json({ message: 'Nội dung bình luận không được để trống.' });
        }

        const newComment = new Comment({
            content,
            author: userId,
            postId
        });
        await newComment.save();

        // Tùy chọn: Tăng commentCount trong Post model nếu bạn có trường này
        // await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

        res.status(201).json({ message: 'Bình luận đã được đăng.' });
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ message: 'Lỗi server khi đăng bình luận.' });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
                                    .populate('author', 'username avatar') // <-- SỬA LẠI THÀNH 'avatar' // <-- SỬA DÒNG NÀY
                                    .sort({ createdAt: 1 }); // Sắp xếp cũ nhất trước

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy bình luận.' });
    }
});

module.exports = router;