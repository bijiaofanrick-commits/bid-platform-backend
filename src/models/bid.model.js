const db = require('../config/database');

class BidModel {
  // 获取招标列表（支持分页、筛选、搜索）
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      location,
      min_budget,
      max_budget,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // 搜索条件
    if (search) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    // 分类筛选
    if (category) {
      conditions.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    // 状态筛选
    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    // 地点筛选
    if (location) {
      conditions.push(`location ILIKE $${paramIndex}`);
      params.push(`%${location}%`);
      paramIndex++;
    }

    // 预算范围
    if (min_budget !== undefined) {
      conditions.push(`budget_max >= $${paramIndex}`);
      params.push(min_budget);
      paramIndex++;
    }

    if (max_budget !== undefined) {
      conditions.push(`budget_min <= $${paramIndex}`);
      params.push(max_budget);
      paramIndex++;
    }

    // 构建WHERE子句
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 验证排序字段（防止SQL注入）
    const allowedSortFields = ['id', 'title', 'created_at', 'updated_at', 'deadline', 'budget_min', 'budget_max'];
    const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    const safeSortOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // 查询数据
    const dataQuery = `
      SELECT * FROM bids
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM bids ${whereClause}`;
    const countParams = params.slice(0, -2); // 去掉limit和offset

    const [dataResult, countResult] = await Promise.all([
      db.query(dataQuery, params),
      db.query(countQuery, countParams)
    ]);

    return {
      data: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        total_pages: Math.ceil(countResult.rows[0].count / limit)
      }
    };
  }

  // 根据ID获取招标详情
  static async findById(id) {
    const query = 'SELECT * FROM bids WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  // 创建招标
  static async create(bidData) {
    const {
      title,
      description,
      budget_min,
      budget_max,
      deadline,
      location,
      category,
      department,
      source_url,
      status = 'active'
    } = bidData;

    const query = `
      INSERT INTO bids (title, description, budget_min, budget_max, deadline, location, category, department, source_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [title, description, budget_min, budget_max, deadline, location, category, department, source_url, status];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // 更新招标
  static async update(id, bidData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // 动态构建更新字段
    const allowedFields = ['title', 'description', 'budget_min', 'budget_max', 'deadline', 'location', 'category', 'department', 'source_url', 'status'];
    
    for (const [key, value] of Object.entries(bidData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw new Error('没有提供有效的更新字段');
    }

    values.push(id);
    const query = `
      UPDATE bids
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  // 删除招标
  static async delete(id) {
    const query = 'DELETE FROM bids WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  // 获取所有分类
  static async getCategories() {
    const query = 'SELECT DISTINCT category FROM bids WHERE category IS NOT NULL ORDER BY category';
    const result = await db.query(query);
    return result.rows.map(row => row.category);
  }

  // 获取所有状态
  static async getStatuses() {
    const query = 'SELECT DISTINCT status FROM bids ORDER BY status';
    const result = await db.query(query);
    return result.rows.map(row => row.status);
  }

  // 获取所有地点
  static async getLocations() {
    const query = 'SELECT DISTINCT location FROM bids WHERE location IS NOT NULL ORDER BY location';
    const result = await db.query(query);
    return result.rows.map(row => row.location);
  }
}

module.exports = BidModel;