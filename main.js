require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
// const methodOverride = require('method-override');
const request = require('request');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));

// 配置 CORS 以支援 Vercel 前端
const corsOptions = {
    origin: [
        'http://localhost:3000', // 本地開發
        'https://suspended-mael-frontend.vercel.app', // 替換為您的 Vercel 域名
        'https://suspendedmealbackend.zeabur.app', // 後端域名
        /\.vercel\.app$/, // 允許所有 Vercel 子域名
        /\.zeabur\.app$/ // 允許所有 Zeabur 子域名
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// 使用環境變數配置 MongoDB 連接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freeMeals';

// 添加健康檢查端點
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('/api', (req, res) => {
    res.send('Hello from Express!');
});

// 引入路由
const userRoutes = require('./routes/usersRoute');
const productRoutes = require('./routes/productsRoute');
const signRoutes = require('./routes/signRoute');

// 使用路由
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sign', signRoutes);

// 啟動伺服器的函數
const startServer = async () => {
    try {
        // 先連接資料庫
        console.log("🔄 正在連接到 MongoDB...");

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10秒超時
            socketTimeoutMS: 45000 // 45秒 socket 超時
        });

        console.log("✅ MONGO CONNECTION OPEN!!!");
        console.log("資料庫連接狀態:", mongoose.connection.readyState);

        // 資料庫連接成功後才啟動伺服器
        const PORT = process.env.PORT || 1000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log('🌍 伺服器綁定到 0.0.0.0 (所有網路介面)');
        });
    } catch (err) {
        console.log("❌ OH NO MONGO CONNECTION ERROR!!!!");
        console.log("錯誤詳情:", err);
        console.log("連接字串:", MONGODB_URI);
        process.exit(1); // 連接失敗則結束程式
    }
};

// 監聽連接事件
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose 已連接到 MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Mongoose 連接錯誤:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose 已斷開連接');
});

// 啟動伺服器
startServer();