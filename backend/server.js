const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối tới MySQL Database (Sửa mật khẩu nếu cần)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Thay bằng mật khẩu MySQL của bạn trên XAMPP/WAMP
    database: 'novastation'
});

db.connect(err => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('✅ Đã kết nối thành công tới MySQL Database');
});

// API Lấy danh sách Game
app.get('/api/games', (req, res) => {
    db.query('SELECT * FROM games ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// API Thêm Game Mới
app.post('/api/games', (req, res) => {
    const { title, category, price, oldPrice, image, desc } = req.body;
    
    // Thêm vào bảng games (Bỏ qua category_id phức tạp để ví dụ đơn giản)
    const sql = `INSERT INTO games (title, price, original_price, image_main, short_description) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sql, [title, price, oldPrice, image, desc], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Thêm game thành công!', id: result.insertId });
    });
});

// API Cập nhật Game (Sửa)
app.put('/api/games/:id', (req, res) => {
    const { id } = req.params;
    const { title, price, oldPrice, image, desc } = req.body;
    const sql = `UPDATE games SET title=?, price=?, original_price=?, image_main=?, short_description=? WHERE id=?`;
    
    db.query(sql, [title, price, oldPrice, image, desc, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cập nhật thành công!' });
    });
});

// API Xóa Game
app.delete('/api/games/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM games WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Xóa thành công!' });
    });
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
});