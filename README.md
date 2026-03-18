# 招标数据API服务

基于Node.js + Express + PostgreSQL的招标数据管理API服务。

## 功能特性

- RESTful API设计
- 完整的CRUD操作
- 分页、筛选、搜索支持
- PostgreSQL数据库
- 数据验证
- 错误处理

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

### 3. 初始化数据库

```bash
npm run db:init
```

### 4. 启动服务

```bash
npm run dev  # 开发模式
# 或
npm start    # 生产模式
```

## API文档

### 招标列表

```
GET /api/bids?page=1&limit=10&search=keyword&category=IT&status=active
```

查询参数：
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `search`: 搜索关键词（标题、描述）
- `category`: 分类筛选
- `status`: 状态筛选
- `location`: 地点筛选
- `min_budget`: 最小预算
- `max_budget`: 最大预算

### 招标详情

```
GET /api/bids/:id
```

### 创建招标

```
POST /api/bids
Content-Type: application/json

{
  "title": "项目名称",
  "description": "项目描述",
  "budget_min": 100000,
  "budget_max": 500000,
  "deadline": "2024-12-31",
  "location": "Toronto, ON",
  "category": "IT",
  "department": "Department Name",
  "source_url": "https://example.com/bid/123"
}
```

### 更新招标

```
PUT /api/bids/:id
Content-Type: application/json

{
  "title": "更新后的项目名称",
  "status": "closed"
}
```

## 数据库表结构

### bids表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 自增ID |
| title | VARCHAR(500) NOT NULL | 招标标题 |
| description | TEXT | 招标描述 |
| budget_min | DECIMAL(15,2) | 最低预算 |
| budget_max | DECIMAL(15,2) | 最高预算 |
| deadline | DATE | 截止日期 |
| location | VARCHAR(200) | 地点 |
| category | VARCHAR(100) | 分类 |
| department | VARCHAR(200) | 部门/机构 |
| source_url | VARCHAR(1000) | 来源链接 |
| status | VARCHAR(50) DEFAULT 'active' | 状态 |
| created_at | TIMESTAMP DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP DEFAULT NOW() | 更新时间 |
