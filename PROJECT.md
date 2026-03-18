# 招标数据API服务

## 项目结构

```
bid-platform/backend/
├── src/
│   ├── config/
│   │   └── database.js       # 数据库配置
│   ├── controllers/
│   │   └── bid.controller.js # 招标控制器
│   ├── middleware/
│   │   └── validation.js     # 验证中间件
│   ├── models/
│   │   └── bid.model.js      # 招标数据模型
│   ├── routes/
│   │   └── bid.routes.js     # 招标路由
│   ├── app.js                # Express应用配置
│   └── index.js              # 入口文件
├── scripts/
│   ├── init-db.sql           # 数据库初始化SQL
│   └── init-db.js            # 数据库初始化脚本
├── .env.example              # 环境变量示例
├── package.json              # 项目依赖
└── README.md                 # 项目文档
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件配置数据库连接
```

### 3. 初始化数据库

```bash
# 先创建数据库
createdb bid_platform

# 然后初始化表结构和数据
npm run db:init
```

### 4. 启动服务

```bash
# 开发模式（带热重载）
npm run dev

# 生产模式
npm start
```

## API接口

### 基础信息

- 基础URL: `http://localhost:3000/api`
- 健康检查: `GET /health`

### 招标接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/bids` | 获取招标列表 |
| GET | `/api/bids/:id` | 获取招标详情 |
| POST | `/api/bids` | 创建招标 |
| PUT | `/api/bids/:id` | 更新招标 |
| DELETE | `/api/bids/:id` | 删除招标 |
| GET | `/api/bids/filters` | 获取筛选选项 |

### 查询参数

**GET /api/bids** 支持以下查询参数：

- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `search`: 搜索关键词（搜索标题和描述）
- `category`: 分类筛选
- `status`: 状态筛选（active, closed, draft, cancelled）
- `location`: 地点筛选
- `min_budget`: 最小预算
- `max_budget`: 最大预算
- `sort_by`: 排序字段（id, title, created_at, deadline, budget_min, budget_max）
- `sort_order`: 排序方向（ASC, DESC）

### 示例请求

**获取招标列表：**
```bash
curl "http://localhost:3000/api/bids?page=1&limit=5&search=IT"
```

**创建招标：**
```bash
curl -X POST http://localhost:3000/api/bids \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New IT Project",
    "description": "Project description",
    "budget_min": 100000,
    "budget_max": 500000,
    "deadline": "2024-12-31",
    "location": "Toronto, ON",
    "category": "IT",
    "department": "IT Department",
    "source_url": "https://example.com/bid/123"
  }'
```

**更新招标：**
```bash
curl -X PUT http://localhost:3000/api/bids/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "closed"
  }'
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