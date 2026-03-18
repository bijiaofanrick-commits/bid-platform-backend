require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 招标数据API服务已启动`);
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🔧 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API文档: http://localhost:${PORT}/health`);
});