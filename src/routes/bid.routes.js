const express = require('express');
const router = express.Router();
const BidController = require('../controllers/bid.controller');
const { createBidValidation, updateBidValidation } = require('../middleware/validation');

// 获取筛选选项
router.get('/filters', BidController.getFilterOptions);

// 获取招标列表
router.get('/', BidController.getBids);

// 获取招标详情
router.get('/:id', BidController.getBidById);

// 创建招标
router.post('/', createBidValidation, BidController.createBid);

// 更新招标
router.put('/:id', updateBidValidation, BidController.updateBid);

// 删除招标
router.delete('/:id', BidController.deleteBid);

module.exports = router;