const mongoose = require('mongoose');
const FreeMealProduct = require('./models/freeMealProductModel'); // 导入Mongoose模型

mongoose.connect('mongodb://localhost:27017/freeMeals')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");

        // 创建多个新的freeMealProduct文档实例的数组
        const newProducts = [
            {
                userId: '785f7a05-501d-4ddf-9bb1-690570fab182',
                productName: 'ginger fried rice',
                dailyQuantity: 10,
                campaignExpiration: new Date('2024-07-31')
            },
            {
                userId: '785f7a05-501d-4ddf-9bb1-690570fab182',
                productName: 'ham fried rice',
                dailyQuantity: 10,
                campaignExpiration: new Date('2024-08-31')
            },
            {
                userId: '785f7a05-501d-4ddf-9bb1-690570fab182',
                productName: 'beef fried rice',
                dailyQuantity: 10,
                campaignExpiration: new Date('2024-12-31')
            },
            {
                userId: 'cf5d3493-82a7-47e5-b50f-65f48b6588a9',
                productName: 'hawaiian pasta',
                dailyQuantity: 15,
                campaignExpiration: new Date('2024-06-28')
            },
            {
                userId: 'cf5d3493-82a7-47e5-b50f-65f48b6588a9',
                productName: 'bitter gourd pasta',
                dailyQuantity: 3,
                campaignExpiration: new Date('2024-04-20')
            },
            {
                userId: 'cf5d3493-82a7-47e5-b50f-65f48b6588a9',
                productName: 'pumpkin pasta',
                dailyQuantity: 50,
                campaignExpiration: new Date('2024-09-27')
            },
            {
                userId: 'c3f55534-8a66-4509-aa2e-c72baf696bce',
                productName: 'meatball curry',
                dailyQuantity: 7,
                campaignExpiration: new Date('2024-06-30')
            },
            {
                userId: 'c3f55534-8a66-4509-aa2e-c72baf696bce',
                productName: 'french fries curry',
                dailyQuantity: 20,
                campaignExpiration: new Date('2024-08-16')
            },
            {
                userId: 'c3f55534-8a66-4509-aa2e-c72baf696bce',
                productName: 'pork cutlet curry',
                dailyQuantity: 90,
                campaignExpiration: new Date('2024-12-31')
            }
        ];

        // // 将新文档数组保存到数据库
        // FreeMealProduct.insertMany(newProducts)
        //     .then(res => { console.log(res) })
        //     .catch(e => console.log(e))
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    });


// const products = [
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d0'),
//         userId: '785f7a05-501d-4ddf-9bb1-690570fab182',
//         productName: '薑絲炒飯',
//         dailyQuantity: 10,
//         campaignExpiration: ISODate('2024-07-31T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d1'),
//         userId: '785f7a05-501d-4ddf-9bb1-690570fab182',
//         productName: '火腿炒飯',
//         dailyQuantity: 10,
//         campaignExpiration: ISODate('2024-08-31T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d2'),
//         userId: '785f7a05-501d-4ddf-9bb1-690570fab182',
//         productName: '牛肉炒飯',
//         dailyQuantity: 10,
//         campaignExpiration: ISODate('2024-12-31T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d3'),
//         userId: 'cf5d3493-82a7-47e5-b50f-65f48b6588a9',
//         productName: '夏威夷義大利麵',
//         dailyQuantity: 15,
//         campaignExpiration: ISODate('2024-06-28T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d4'),
//         userId: 'cf5d3493-82a7-47e5-b50f-65f48b6588a9',
//         productName: '苦瓜義大利麵',
//         dailyQuantity: 3,
//         campaignExpiration: ISODate('2024-04-20T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d5'),
//         userId: 'cf5d3493-82a7-47e5-b50f-65f48b6588a9',
//         productName: '南瓜義大利麵',
//         dailyQuantity: 50,
//         campaignExpiration: ISODate('2024-09-27T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d6'),
//         userId: 'c3f55534-8a66-4509-aa2e-c72baf696bce',
//         productName: '肉丸咖哩',
//         dailyQuantity: 7,
//         campaignExpiration: ISODate('2024-06-30T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d7'),
//         userId: 'c3f55534-8a66-4509-aa2e-c72baf696bce',
//         productName: '薯條咖哩',
//         dailyQuantity: 20,
//         campaignExpiration: ISODate('2024-08-16T00:00:00.000Z'),
//         __v: 0
//     },
//     {
//         _id: ObjectId('666d60f714a17d9ec47011d8'),
//         userId: 'c3f55534-8a66-4509-aa2e-c72baf696bce',
//         productName: '豬排咖哩',
//         dailyQuantity: 90,
//         campaignExpiration: ISODate('2024-12-31T00:00:00.000Z'),
//         __v: 0
//     }
// ]