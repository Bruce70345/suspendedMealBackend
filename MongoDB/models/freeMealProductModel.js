const mongoose = require('mongoose');

const freeMealProductSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    dailyQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    campaignExpiration: {
        type: Date,
        required: true,
        set: (value) => new Date(value)
    }
});


const freeMealProduct = mongoose.model('freeMealProduct', freeMealProductSchema);

module.exports = freeMealProduct;