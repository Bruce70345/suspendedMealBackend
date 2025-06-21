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
        'https://www.suspendedmeal.brucechen70345.com',
        'https://suspendedmeal.brucechen70345.com',
        'https://suspendedmealbackend.zeabur.app', // 後端域名
        /\.vercel\.app$/, // 允許所有 Vercel 子域名
        /\.zeabur\.app$/, // 允許所有 Zeabur 子域名
        /\.brucechen70345\.com$/ // 允許所有 Bruce Chen 子域名
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// 使用環境變數配置 MongoDB 連接
const MONGODB_URI = process.env.MONGODB_URI;

// 根路徑 - 健康檢查
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API is running',
        time: new Date().toISOString()
    });
});

// 添加健康檢查端點
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    res.status(200).json({
        status: 'OK',
        db: states[dbState] || 'unknown',
        time: new Date().toISOString()
    });
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
    // 先啟動伺服器，確保健康檢查能夠響應
    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log('🌍 伺服器綁定到 0.0.0.0 (所有網路介面)');
    });

    // 嘗試連接資料庫，但不會阻止伺服器啟動
    try {
        console.log("🔄 正在連接到 MongoDB...");
        console.log("連接字串:", MONGODB_URI.includes("mongodb+srv") ? "mongodb+srv://******" : MONGODB_URI);

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10秒超時
            socketTimeoutMS: 45000 // 45秒 socket 超時
        });

        console.log("✅ MONGO CONNECTION OPEN!!!");
        console.log("資料庫連接狀態:", mongoose.connection.readyState);
    } catch (err) {
        console.log("⚠️ MongoDB 連接錯誤，但伺服器仍在運行");
        console.log("❌ 錯誤詳情:", err.message);
        // 不退出程序，讓伺服器繼續運行
    }

    // 優雅關閉
    process.on('SIGTERM', () => {
        console.log('📴 收到 SIGTERM 信號，正在關閉伺服器...');
        server.close(() => {
            console.log('✅ HTTP 伺服器已關閉');
            mongoose.connection.close(false, () => {
                console.log('✅ MongoDB 連接已關閉');
                process.exit(0);
            });
        });
    });

    process.on('SIGINT', () => {
        console.log('📴 收到 SIGINT 信號，正在關閉伺服器...');
        server.close(() => {
            console.log('✅ HTTP 伺服器已關閉');
            mongoose.connection.close(false, () => {
                console.log('✅ MongoDB 連接已關閉');
                process.exit(0);
            });
        });
    });
};

// 監聽連接事件
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose 已連接到 MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Mongoose 連接錯誤:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose 已斷開連接');
});

// 啟動伺服器
startServer();