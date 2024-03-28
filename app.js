// npm init -y
// npm install mysql express cors path 
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_manage'
});

// Kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database with ID: ' + db.threadId);
});

// Sử dụng middleware CORS
app.use(cors());

// Sử dụng JSON middleware để xử lý dữ liệu JSON
app.use(express.json());


//
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'./index.html'));
})

// Controller
const productController = {
    // Tìm kiếm sản phẩm bằng ID
    getProductById: (req, res) => {
        const MaSP = req.params.MaSP;
        const query = `SELECT * FROM products WHERE MaSP = ?`;
        db.query(query, [MaSP], (err, results) => {
            if (err) {
                console.error('Error searching product by ID: ' + err.stack);
                res.status(500).send('Server error');
                return;
            }
            if (results.length === 0) {
                res.status(404).send('Product not found');
                return;
            }
            res.json(results[0]);
        });
    },

    // Thêm sản phẩm
    addProduct: (req, res) => {
        const { MaSP, TenSP, NgaySX, NgayHetHan, NoiSX } = req.body;
        const query = `INSERT INTO products (MaSP, TenSP, NgaySX, NgayHetHan, NoiSX) VALUES (?,?, ?, ?, ?)`;
        db.query(query, [MaSP, TenSP, NgaySX, NgayHetHan, NoiSX], (err, result) => {
            if (err) {
                console.error('Error adding product: ' + err.stack);
                res.status(500).send('Server error');
                return;
            }
            res.status(201).send('Product added successfully');
        });
    },

    // Xóa sản phẩm
    deleteProduct: (req, res) => {
        const MaSP = req.params.MaSP;
        const query = `DELETE FROM products WHERE MaSP = ?`;
        db.query(query, [MaSP], (err, result) => {
            if (err) {
                console.error('Error deleting product: ' + err.stack);
                res.status(500).send('Server error');
                return;
            }
            res.status(200).send('Product deleted successfully');
        });
    },

    // Sửa thông tin sản phẩm
    updateProduct: (req, res) => {
        const MaSP = req.params.MaSP;
        const { TenSP, NgaySX, NgayHetHan, NoiSX } = req.body;
        const query = `UPDATE products SET TenSP = ?, NgaySX = ?, NgayHetHan = ?, NoiSX = ? WHERE MaSP = ?`;
        db.query(query, [TenSP, NgaySX, NgayHetHan, NoiSX, MaSP], (err, result) => {
            if (err) {
                console.error('Error updating product: ' + err.stack);
                res.status(500).send('Server error');
                return;
            }
            res.status(200).send('Product updated successfully');
        });
    },

    // Lấy toàn bộ dữ liệu
    getAllProduct: (req, res) => {
        try {
            db.query('select *from products', (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(404).json({message: err});

                }
                return res.status(200).json({ message: "SUCCESS", data: result });
            })


        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Internal err' });
        }

    }

};

// Routes
app.get('/products', productController.getAllProduct);
app.get('/products/:MaSP', productController.getProductById);
app.post('/products', productController.addProduct);
app.delete('/products/:MaSP', productController.deleteProduct);
app.put('/products/:MaSP', productController.updateProduct);

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
