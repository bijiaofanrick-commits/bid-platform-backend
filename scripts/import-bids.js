const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 数据库配置
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bidplatform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

// 读取爬取的数据
const dataPath = path.join(__dirname, '..', 'scraper', 'data', 'canadabuys_bids.json');
const bidsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 导入数据到数据库
async function importBids() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 开始导入招标数据...');
    
    let importedCount = 0;
    let errorCount = 0;
    
    for (const bid of bidsData) {
      try {
        const query = `
          INSERT INTO bids (
            title, description, budget_min, budget_max, deadline,
            location, category, department, source_url, status,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (source_url) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            budget_min = EXCLUDED.budget_min,
            budget_max = EXCLUDED.budget_max,
            deadline = EXCLUDED.deadline,
            location = EXCLUDED.location,
            category = EXCLUDED.category,
            department = EXCLUDED.department,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at
          RETURNING id
        `;
        
        const values = [
          bid.title,
          bid.description,
          bid.budgetMin,
          bid.budgetMax,
          bid.closingDate ? new Date(bid.closingDate) : null,
          bid.location,
          bid.category,
          bid.organization,
          bid.sourceUrl,
          bid.status || 'open',
          new Date(),
          new Date()
        ];
        
        const result = await client.query(query, values);
        importedCount++;
        console.log(`✅ 导入成功: ${bid.title.substring(0, 50)}... (ID: ${result.rows[0].id})`);
      } catch (error) {
        errorCount++;
        console.error(`❌ 导入失败: ${bid.title}`, error.message);
      }
    }
    
    console.log('\n📊 导入完成:');
    console.log(`- 成功: ${importedCount} 条`);
    console.log(`- 失败: ${errorCount} 条`);
    console.log(`- 总计: ${bidsData.length} 条`);
    
  } catch (error) {
    console.error('导入过程出错:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// 检查数据库连接
async function checkConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.log('\n💡 请确保:');
    console.log('1. PostgreSQL 已启动');
    console.log('2. 数据库 bidplatform 已创建');
    console.log('3. 数据库配置正确 (.env 文件)');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 招标数据导入工具\n');
  
  const connected = await checkConnection();
  if (!connected) {
    process.exit(1);
  }
  
  await importBids();
}

main().catch(console.error);
