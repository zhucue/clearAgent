# 后端

Node.js + Express + TypeScript

## 开发

```bash
npm install
cp .env.example .env  # 配置 API 密钥
npm run dev
```

## 构建

```bash
npm run build
npm start
```

## API 接口

- `POST /api/analyze` - 分析文件并生成清洗策略
- `POST /api/execute` - 执行清洗
- `GET /api/download/:filename` - 下载结果
- `GET /api/cleaners` - 获取清洗器列表
- `GET /health` - 健康检查

## 环境变量

```env
PORT=3001
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-key
```

支持的 LLM 提供商：

- `deepseek` - DeepSeek API (推荐)
- `openai` - OpenAI API
- `anthropic` - Anthropic Claude API
