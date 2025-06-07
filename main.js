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
        /\.vercel\.app$/ // 允許所有 Vercel 子域名
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// 使用環境變數配置 MongoDB 連接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freeMeals';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
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

// 使用環境變數配置 port
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});