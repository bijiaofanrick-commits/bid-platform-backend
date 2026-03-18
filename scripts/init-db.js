require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bid_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('开始初始化数据库...');
    
    // 读取SQL文件
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // 执行SQL
    await client.query(sql);
    
    console.log('✅ 数据库初始化成功！');
    console.log('📊 已创建bids表并插入测试数据');
    
    // 验证数据
    const result = await client.query('SELECT COUNT(*) FROM bids');
    console.log(`📈 当前招标记录数: ${result.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();