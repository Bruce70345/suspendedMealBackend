const express = require('express');
const router = express.Router();
const Products = require('../MongoDB/models/freeMealProductModel.js');


// 獲取所有產品
router.get('/', async (req, res) => {
    try {
        console.log('📋 獲取所有產品');
        const products = await Products.find();
        console.log(`✅ 找到 ${products.length} 個產品`);
        res.json(products);
    } catch (err) {
        console.error('❌ 獲取產品失敗:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// 獲取用戶的所有產品
router.get('/:userId', async (req, res) => {
    try {
        console.log(`🔍 獲取用戶 ${req.params.userId} 的所有產品`);
        const products = await Products.find({ userId: req.params.userId });
        console.log(`✅ 找到 ${products.length} 個產品`);
        res.json(products);
    } catch (err) {
        console.error(`❌ 獲取用戶 ${req.params.userId} 產品失敗:`, err.message);
        res.status(500).json({ message: err.message });
    }
});

// 獲取用戶的產品
const getProduct = async (req, res, next) => {
    let product;
    try {
        console.log(`🔍 查找產品 ID: ${req.params.productId}`);
        product = await Products.findOne({ _id: req.params.productId });
        if (!product) {
            console.log(`❌ 找不到產品 ID: ${req.params.productId}`);
            return res.status(404).json({ message: 'Cannot find product' });
        }
        console.log(`✅ 找到產品: ${product.productName}`);
    } catch (err) {
        console.error(`❌ 查找產品錯誤:`, err.message);
        return res.status(500).json({ message: err.message });
    }

    res.product = product;
    next();
};
router.get('/:userId/:productId', getProduct, async (req, res) => {
    try {
        res.json(res.product);
    } catch (err) {
        console.error('❌ 返回產品資訊失敗:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// 新增產品
router.post('/:userId', async (req, res) => {
    try {
        console.log(`📝 新增產品, 用戶 ID: ${req.params.userId}`);
        const product = new Products(req.body);
        const newProduct = await product.save();
        console.log(`✅ 產品新增成功: ${newProduct.productName}`);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('❌ 新增產品失敗:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// 更新用戶的產品
router.patch('/:userId/:productId', getProduct, async (req, res) => {
    try {
        console.log(`📝 更新產品: ${req.params.productId}`);
        if (req.body.productName != null) {
            res.product.productName = req.body.productName;
        }
        if (req.body.dailyQuantity != null) {
            res.product.dailyQuantity = req.body.dailyQuantity;
        }
        if (req.body.campaignExpiration != null) {
            res.product.campaignExpiration = req.body.campaignExpiration;
        }
        const updatedProduct = await res.product.save();
        console.log(`✅ 產品更新成功: ${updatedProduct.productName}`);
        res.json(updatedProduct);
    } catch (err) {
        console.error('❌ 更新產品失敗:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// 刪除用戶的產品
router.delete('/:userId/:productId', getProduct, async (req, res) => {
    try {
        console.log(`🗑️ 刪除產品: ${req.params.productId}`);
        await res.product.deleteOne();
        console.log('✅ 產品刪除成功');
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        console.error('❌ 刪除產品失敗:', err.message);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
