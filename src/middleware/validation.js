const { body, param, validationResult } = require('express-validator');

// 处理验证错误
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array()
    });
  }
  next();
};

// 创建招标的验证规则
const createBidValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('标题不能为空')
    .isLength({ max: 500 })
    .withMessage('标题长度不能超过500字符'),
  body('description')
    .optional()
    .trim(),
  body('budget_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('最低预算必须是非负数'),
  body('budget_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('最高预算必须是非负数'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('截止日期格式无效'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('地点长度不能超过200字符'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('分类长度不能超过100字符'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('部门长度不能超过200字符'),
  body('source_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('来源链接必须是有效的URL')
    .isLength({ max: 1000 })
    .withMessage('来源链接长度不能超过1000字符'),
  body('status')
    .optional()
    .trim()
    .isIn(['active', 'closed', 'draft', 'cancelled'])
    .withMessage('状态必须是 active, closed, draft 或 cancelled'),
  handleValidationErrors
];

// 更新招标的验证规则
const updateBidValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID必须是正整数'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('标题不能为空')
    .isLength({ max: 500 })
    .withMessage('标题长度不能超过500字符'),
  body('description')
    .optional()
    .trim(),
  body('budget_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('最低预算必须是非负数'),
  body('budget_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('最高预算必须是非负数'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('截止日期格式无效'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('地点长度不能超过200字符'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('分类长度不能超过100字符'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('部门长度不能超过200字符'),
  body('source_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('来源链接必须是有效的URL')
    .isLength({ max: 1000 })
    .withMessage('来源链接长度不能超过1000字符'),
  body('status')
    .optional()
    .trim()
    .isIn(['active', 'closed', 'draft', 'cancelled'])
    .withMessage('状态必须是 active, closed, draft 或 cancelled'),
  handleValidationErrors
];

// 获取招标列表的验证规则
const listBidsValidation = [
  param('id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID必须是正整数'),
  handleValidationErrors
];

module.exports = {
  createBidValidation,
  updateBidValidation,
  listBidsValidation,
  handleValidationErrors
};