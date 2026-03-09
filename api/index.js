const express = require('express');
const { createSSEStream } = require('music-mcp-server');
const app = express();

app.get('/sse', (req, res) => {
  createSSEStream(req, res);创建SSE流(请求, 响应);
});

module.exports = app;模块.导出 = 应用;模块.导出 = 应用;模块.导出 = 应用;
