const express = require('express');
const router = express.Router();
const Products = require('../MongoDB/models/freeMealProductModel.js');


// 獲取所有產品
router.get('/', async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 獲取用戶的所有產品
router.get('/:userId', async (req, res) => {
    try {
        const products = await Products.find({ userId: req.params.userId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 獲取用戶的產品
const getProduct = async (req, res, next) => {
    let product;
    try {
        product = await Products.findOne({ _id: req.params.productId });
        if (!product) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.product = product;
    next();
};
router.get('/:userId/:productId', getProduct, async (req, res) => {
    try {
        res.json(res.product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 新增產品
router.post('/:userId', async (req, res) => {
    try {
        const product = new Products(req.body);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 更新用戶的產品
router.patch('/:userId/:productId', getProduct, async (req, res) => {
    try {
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
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 刪除用戶的產品
router.delete('/:userId/:productId', getProduct, async (req, res) => {
    try {
        await res.product.deleteOne();
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
