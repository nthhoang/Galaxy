const mongoose = require('mongoose');

const NewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: { // Thêm trường này để lưu đường dẫn ảnh thumbnail
        type: String,
        default: null // Mặc định là null nếu không có ảnh
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('New', NewSchema);