const express = require('express');
const request = require('request');
const router = express.Router();
const Users = require('../MongoDB/models/freeMealUserModel.js');

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`🔑 嘗試登入: ${email}`);

        if (!email || !password) {
            console.log('❌ 登入失敗: 缺少電子郵件或密碼');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await Users.findOne({ email: email, password: password });

        if (user) {
            console.log(`✅ 用戶登入成功: ${email}`);
            res.json({ success: true, user });
        } else {
            console.log(`❌ 登入失敗: 找不到用戶 ${email} 或密碼錯誤`);
            res.status(401).json({ success: false, message: 'authentication failed' });
        }
    } catch (error) {
        console.error('❌ 伺服器錯誤:', error.message);
        res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
});


module.exports = router;
