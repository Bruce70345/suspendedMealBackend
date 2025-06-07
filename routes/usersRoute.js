const express = require('express');
const request = require('request');
const router = express.Router();
const Users = require('../MongoDB/models/freeMealUserModel.js');
const { v4: uuid } = require('uuid');


// POST /api/users - 新增用户
const addUuidMiddleware = async (req, res, next) => {
    console.log('📝 開始處理新用戶註冊:', req.body);
    const generatedId = uuid();

    try {
        let lnglat = null;

        // 如果有地址，嘗試獲取座標
        if (req.body.address) {
            try {
                lnglat = await geocodeAddress(req.body.address);
                console.log('📍 成功獲取座標:', lnglat);
            } catch (geocodeError) {
                console.log('⚠️ 地址解析失敗，但繼續創建用戶:', geocodeError);
                // 不阻止用戶創建，只是沒有座標資訊
            }
        }

        req.body = {
            ...req.body,
            userId: generatedId,
            ...(lnglat && { lnglat: lnglat }) // 只有在有座標時才添加
        };

        console.log('✅ 用戶資料準備完成:', req.body);
        next();
    } catch (error) {
        console.error('❌ addUuidMiddleware 錯誤:', error);
        // 即使出錯也繼續，確保用戶可以註冊
        req.body = {
            ...req.body,
            userId: generatedId
        };
        next();
    }
};

function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
        // 檢查是否有 Google Maps API 金鑰
        if (!process.env.GOOGLE_MAPS_API) {
            console.log('⚠️ 沒有 Google Maps API 金鑰');
            reject('No Google Maps API key');
            return;
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API}`;
        console.log('🌍 請求 Google Maps API:', address);

        // 請求 Google Maps Geocoding API
        request(url, { json: true, timeout: 5000 }, (err, response, body) => {
            if (err) {
                console.log('❌ Google Maps API 請求錯誤:', err.message);
                reject('Google Maps API request failed');
                return;
            }

            if (!body) {
                console.log('❌ Google Maps API 沒有回應');
                reject('No response from Google Maps API');
                return;
            }

            if (body.status === 'OK' && body.results && body.results.length > 0) {
                const location = body.results[0].geometry.location;
                console.log('✅ 成功獲取座標:', location);
                resolve({
                    lat: location.lat,
                    lng: location.lng
                });
            } else {
                console.log('❌ Google Maps API 狀態:', body.status, body.error_message || '');
                reject(`Address geocoding failed: ${body.status}`);
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
