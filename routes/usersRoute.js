const express = require('express');
const request = require('request');
const router = express.Router();
const Users = require('../MongoDB/models/freeMealUserModel.js');
const { v4: uuid } = require('uuid');


// POST /api/users - 新增用户
const addUuidMiddleware = async (req, res, next) => {
    const generatedId = uuid();

    try {
        const lnglat = await geocodeAddress(req.body.address);

        req.body = {
            ...req.body,
            userId: generatedId,
            lnglat: lnglat
        };

        next();
    } catch (error) {
        console.error('Error:', error);
        next(error); // Pass error to the error handling middleware
    }
};

function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API}`;

        // 請求 Google Maps Geocoding API
        request(url, { json: true }, (err, response, body) => {
            if (err) {
                reject('Internal Server Error');
                return;
            }

            if (body.status === 'OK') {
                const location = body.results[0].geometry.location;
                resolve({
                    lat: location.lat,
                    lng: location.lng
                });
            } else {
                reject('Address not found');
            }
        });
    });
}


router.post('/', addUuidMiddleware, async (req, res) => {
    try {
        const newUser = new Users(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// GET /api/users - 讀取用户
router.get('/', async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//Get User Middleware
const getUser = async (req, res, next) => {
    let user;
    try {
        user = await Users.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
};


// GET 根據id查看用戶
router.get('/:userId', getUser, async (req, res) => {
    res.json(res.user);
});



// PATCH /api/users/:userId - 更新用户资料
router.patch('/:userId', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name;
    }
    if (req.body.address != null) {
        res.user.address = req.body.address;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    if (req.body.secret != null) {
        res.user.secret = req.body.secret;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// DELETE /api/users/:id - 删除用户
router.delete('/:userId', getUser, async (req, res) => {
    try {
        await res.user.deleteOne({ userId: res.user.userId });
        res.json({ message: 'Deleted user' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
