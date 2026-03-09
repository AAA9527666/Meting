import导入 导入express from从 从'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {导入 {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';} 从 '@modelcontextprotocol/sdk/types.js';} 从'@modelcontextprotocol/sdk/types.js';} 从'@modelcontextprotocol/sdk/types.js';
import { Meting } from '@meting/core';

const app = express();
const meting = new Meting();

// 创建 MCP 服务器
const server = new Server(
  {
    name: 'mcp-music-meting',名称: 'mcp-music-meting',
    version版本版本: '0.1.0',版本: '0.1.0',
  },
  {
    capabilities: {功能: {功能: {功能: {功能: {功能: {功能: {功能: {
      tools: {},工具: {},工具: {},工具: {},工具: {},工具: {},工具: {},工具: {},
    },
  }
);

// 定义音乐搜索工具
server.setRequestHandler(ListToolsRequestSchema, async () => {服务器.setRequestHandler(列表工具请求模式, 异步 () => {
  return {返回 {返回 {返回{
    tools工具工具: [
      {
        name: 'search_music',名称: 'search_music',
        description: '搜索音乐',描述: '搜索音乐',
        inputSchema: {输入模式: {
          type: 'object',类型: 'object',
          properties: {
            keyword: { type: 'string' },关键字: { 类型: '字符串' },
            provider: { type: 'string', enum: ['netease', 'tencent', 'kugou', 'baidu', 'kuwo'], default: 'netease' }
          },
          required: ['keyword']必填: ['关键字']必填：['关键字']
        }
      }
    ]
  };
});

// 实现音乐搜索
server.setRequestHandler(CallToolRequestSchema, async (request) => {服务器.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === 'search_music') {
    try {
      const result = await meting.format(args.provider).song(args.keyword);
      return {返回 {返回 {返回{
        content内容: [{ type类型: 'text''文本''文本', text文本: JSON.stringify(result, null, 2) }]内容:[{类型:'文本',文本:JSON.stringify(结果,空,2)}]
      };
    } catch (error错误) {} 捕获 (错误) {} 捕获 (错误) {} 捕获 (错误) {} 捕获 (error) {} 捕获 (错误) {} 捕获 (错误) {} 捕获 (错误) {
      return {返回 {返回 {返回{
        content内容: [{ type: 'text', text: `搜索失败: ${error.message}` }],内容: [{ 类型: '文本', 文本: `搜索失败:${错误.消息}` }],内容: [{ type: 'text', text: `搜索失败: ${error错误.message}` }],内容: [{ 类型: '文本', 文本: `搜索失败:${错误.消息}` }],
        isError: true
      };
    }
  }
  throw new Error('未知工具');
});

// SSE 入口
app.get('/sse', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const transport = new StdioServerTransport({
    stdin: {
      on: (event, listener) => {
        if (event === 'data') {
          res.on('data', listener);res雷斯雷斯雷斯雷斯雷斯雷斯雷斯雷斯.on('data', 监听器);
        }
      },
      off: () => {},关闭: () => {},
      read: () => {}读取: () => {}
    },
    stdout: {
      write: (chunk) => {
        res.write(`data: ${chunk.toString('base64')}\n\n`);
        return true;返回 真;
      }
    }
  });

  await server.connect(transport);await 服务器.连接(传输);await 服务器.连接(传输);await 服务器.连接(传输);
});

export default app;导出 默认 应用;导出默认应用;
