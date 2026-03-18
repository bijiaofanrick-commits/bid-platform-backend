const BidModel = require('../models/bid.model');

class BidController {
  // 获取招标列表
  static async getBids(req, res) {
    try {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        search: req.query.search,
        category: req.query.category,
        status: req.query.status,
        location: req.query.location,
        min_budget: req.query.min_budget ? parseFloat(req.query.min_budget) : undefined,
        max_budget: req.query.max_budget ? parseFloat(req.query.max_budget) : undefined,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order
      };

      const result = await BidModel.findAll(options);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('获取招标列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取招标列表失败',
        error: error.message
      });
    }
  }

  // 获取招标详情
  static async getBidById(req, res) {
    try {
      const { id } = req.params;
      const bid = await BidModel.findById(id);

      if (!bid) {
        return res.status(404).json({
          success: false,
          message: '招标不存在'
        });
      }

      res.json({
        success: true,
        data: bid
      });
    } catch (error) {
      console.error('获取招标详情失败:', error);
      res.status(500).json({
        success: false,
        message: '获取招标详情失败',
        error: error.message
      });
    }
  }

  // 创建招标
  static async createBid(req, res) {
    try {
      const bid = await BidModel.create(req.body);

      res.status(201).json({
        success: true,
        message: '招标创建成功',
        data: bid
      });
    } catch (error) {
      console.error('创建招标失败:', error);
      res.status(500).json({
        success: false,
        message: '创建招标失败',
        error: error.message
      });
    }
  }

  // 更新招标
  static async updateBid(req, res) {
    try {
      const { id } = req.params;
      
      // 检查招标是否存在
      const existingBid = await BidModel.findById(id);
      if (!existingBid) {
        return res.status(404).json({
          success: false,
          message: '招标不存在'
        });
      }

      const bid = await BidModel.update(id, req.body);

      res.json({
        success: true,
        message: '招标更新成功',
        data: bid
      });
    } catch (error) {
      console.error('更新招标失败:', error);
      res.status(500).json({
        success: false,
        message: '更新招标失败',
        error: error.message
      });
    }
  }

  // 删除招标
  static async deleteBid(req, res) {
    try {
      const { id } = req.params;
      
      // 检查招标是否存在
      const existingBid = await BidModel.findById(id);
      if (!existingBid) {
        return res.status(404).json({
          success: false,
          message: '招标不存在'
        });
      }

      await BidModel.delete(id);

      res.json({
        success: true,
        message: '招标删除成功'
      });
    } catch (error) {
      console.error('删除招标失败:', error);
      res.status(500).json({
        success: false,
        message: '删除招标失败',
        error: error.message
      });
    }
  }

  // 获取筛选选项
  static async getFilterOptions(req, res) {
    try {
      const [categories, statuses, locations] = await Promise.all([
        BidModel.getCategories(),
        BidModel.getStatuses(),
        BidModel.getLocations()
      ]);

      res.json({
        success: true,
        data: {
          categories,
          statuses,
          locations
        }
      });
    } catch (error) {
      console.error('获取筛选选项失败:', error);
      res.status(500).json({
        success: false,
        message: '获取筛选选项失败',
        error: error.message
      });
    }
  }
}

module.exports = BidController;