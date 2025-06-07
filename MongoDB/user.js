require('dotenv').config();
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const FreeMealUser = require('./models/freeMealUserModel');

// 使用環境變數中的 MongoDB 連接字串
const MONGODB_URI = process.env.MONGODB_URI;

// 连接 MongoDB 数据库
await mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
        console.log("使用連接字串:", MONGODB_URI.includes("mongodb+srv") ? "mongodb+srv://******" : MONGODB_URI);

        // 定义要插入的多个用户对象
        const newUsers = [
            {
                userId: uuid(),
                name: 'guest',
                password: 'aGuest'
            },
            {
                userId: uuid(),
                name: 'superUser',
                address: '台北市大安區四維路208巷14號',
                password: 'superPassword'
            },
            {
                userId: uuid(),
                name: '義大利麵',
                address: '臺北市中山區五常街6號',
                password: 'italianPasta',
                secret: '來一份美味薯條'
            },
            {
                userId: uuid(),
                name: '台式炒飯',
                address: '臺北市大同區鄭州路29號',
                password: 'taiwaneseFriedrice',
                secret: '西瓜炒飯'
            },
            {
                userId: uuid(),
                name: '日式咖哩',
                address: '臺北市信義區虎林街17號',
                password: 'japaneseCurry',
                secret: '咖喱飯要加鳳梨'
            }
        ];

        // // 将新文档保存到数据库
        // FreeMealUser.insertMany(newUsers)
        //     .then(res => { console.log(res) })
        //     .catch(e => console.log(e))
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    });

// const users = [
//     {
//         userId: '9b87fc0c-eb60-49cb-b20f-fe3b0d5854a3',
//         name: 'guest',
//         password: 'aGuest',
//         _id: new ObjectId('666d5cc454443985d957f1d9'),
//         __v: 0
//     },
//     {
//         userId: '0074e01d-5d30-48bb-b805-a88052c94a36',
//         name: 'superUser',
//         address: '台北市大安區四維路208巷14號',
//         password: 'superPassword',
//         _id: new ObjectId('666d5cc454443985d957f1da'),
//         __v: 0
//     },
//     {
//         userId: 'cf5d3493-82a7-47e5-b50f-65f48b6588a9',
//         name: '義大利麵',
//         address: '臺北市中山區五常街6號',
//         password: 'italianPasta',
//         secret: '來一份美味薯條',
//         _id: new ObjectId('666d5cc454443985d957f1db'),
//         __v: 0
//     },
//     {
//         userId: '785f7a05-501d-4ddf-9bb1-690570fab182',
//         name: '台式炒飯',
//         address: '臺北市大同區鄭州路29號',
//         password: 'taiwaneseFriedrice',
//         secret: '西瓜炒飯',
//         _id: new ObjectId('666d5cc454443985d957f1dc'),
//         __v: 0
//     },
//     {
//         userId: 'c3f55534-8a66-4509-aa2e-c72baf696bce',
//         name: '日式咖哩',
//         address: '臺北市信義區虎林街17號',
//         password: 'japaneseCurry',
//         secret: '咖喱飯要加鳳梨',
//         _id: new ObjectId('666d5cc454443985d957f1dd'),
//         __v: 0
//     }
// ]