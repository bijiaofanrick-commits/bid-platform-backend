-- 初始化数据库脚本
-- 创建数据库（如果不存在）
-- CREATE DATABASE bid_platform;

-- 连接到bid_platform数据库后执行以下脚本

-- 创建bids表
CREATE TABLE IF NOT EXISTS bids (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    deadline DATE,
    location VARCHAR(200),
    category VARCHAR(100),
    department VARCHAR(200),
    source_url VARCHAR(1000),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_category ON bids(category);
CREATE INDEX IF NOT EXISTS idx_bids_location ON bids(location);
CREATE INDEX IF NOT EXISTS idx_bids_deadline ON bids(deadline);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON bids(created_at);

-- 创建全文搜索索引（用于标题和描述搜索）
CREATE INDEX IF NOT EXISTS idx_bids_search ON bids USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
DROP TRIGGER IF EXISTS update_bids_updated_at ON bids;
CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入测试数据
INSERT INTO bids (title, description, budget_min, budget_max, deadline, location, category, department, source_url, status) VALUES
('IT Infrastructure Upgrade Project', 'Upgrade of server infrastructure and network equipment for government department', 500000.00, 1200000.00, '2024-06-30', 'Ottawa, ON', 'IT', 'Public Works and Government Services', 'https://buyandsell.gc.ca/procurement-data/tender-notice/PW-ABC-123', 'active'),
('Office Furniture Supply Contract', 'Supply and delivery of ergonomic office furniture for new office building', 75000.00, 150000.00, '2024-05-15', 'Toronto, ON', 'Furniture', 'Ministry of Transportation', 'https://merx.com/tenders/12345', 'active'),
('Consulting Services for Environmental Assessment', 'Professional consulting services for environmental impact assessment', 200000.00, 400000.00, '2024-07-20', 'Vancouver, BC', 'Consulting', 'Environment and Climate Change Canada', 'https://buyandsell.gc.ca/procurement-data/tender-notice/PW-DEF-456', 'active'),
('Software Development Services', 'Custom software development for internal project management system', 300000.00, 600000.00, '2024-08-10', 'Montreal, QC', 'IT', 'Canada Revenue Agency', 'https://merx.com/tenders/67890', 'active'),
('Security Guard Services', 'Provision of security guard services for federal buildings', 1000000.00, 2500000.00, '2024-04-30', 'Calgary, AB', 'Security', 'Public Safety Canada', 'https://buyandsell.gc.ca/procurement-data/tender-notice/PW-GHI-789', 'closed');
