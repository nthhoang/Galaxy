// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true // Remove whitespace from both ends of a string
    },
    content: {
        type: String,
        required: true // Content is now required
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mediaUrls: [String], // Mảng các URL của ảnh/video
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }] // Mảng các ID người dùng đã thích
}, { timestamps: true });

// Optional: Add a virtual for comment count (will require populating comments)
// Or, keep a commentCount field directly updated on comment creation
// postSchema.virtual('commentCount', {
//     ref: 'Comment',
//     localField: '_id',
//     foreignField: 'postId',
//     count: true
// });

module.exports = mongoose.model('Post', postSchema);