const mongoose = require('mongoose');

const freeMealUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    secret: {
        type: String
    },
    lnglat: {
        type: Map,
        of: String
    },
    email: {
        type: String,
        required: true
    },
})

const freeMealUser = mongoose.model('freeMealUser', freeMealUserSchema);

module.exports = freeMealUser;