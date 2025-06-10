// index.js (hoặc server.js của bạn)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs'); // Import fs để đảm bảo thư mục upload tồn tại

// Load biến môi trường từ file .env
dotenv.config();

// Tạo ứng dụng Express
const app = express();

// Middleware
app.use(express.json()); // Xử lý JSON body để có thể đọc được json trong body của req
app.use(cookieParser()); // Để có thể lấy được token thông qua req.cookie.token

// Cấu hình CORS để cho phép frontend truy cập
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://hoangnth.id.vn'], // địa chỉ frontend (nếu bạn dùng live-server)
  credentials: true
}));

// PHỤC VỤ CÁC FILE TĨNH TỪ THƯ MỤC 'PUBLIC'
// Dòng này sẽ phục vụ tất cả: index.html, assets/, và cả uploads/
app.use(express.static('public'));

// Đảm bảo các thư mục upload tồn tại khi server khởi động
const avatarsDir = path.join(__dirname, 'public', 'uploads', 'avatars');
const postsDir = path.join(__dirname, 'public', 'uploads', 'posts');

if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    console.log(`Created avatars upload directory at ${avatarsDir}`);
}
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
    console.log(`Created posts upload directory at ${postsDir}`);
}


// Kết nối MongoDB
const connectDB = require('./config/db');
connectDB();

// Route API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/news', require('./routes/news'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users', require('./routes/userRoutes'));

// Route mặc định
app.get('/', (req, res) => {
  res.send('🌌 Backend Khám Phá Vũ Trụ đã chạy!');
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});