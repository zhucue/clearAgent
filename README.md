# AI 语料清洗工具

通过自然语言指令智能清洗数据语料。

## 特性

- 自然语言交互 - 用中文描述需求，AI 自动生成清洗策略
- 可视化预览 - 清洗前预览策略，清洗后查看统计
- 多模型支持 - 支持 DeepSeek、OpenAI、Claude 等 LLM API

## 技术栈

**前端**: Vue 3 + TypeScript + Element Plus
**后端**: Node.js + Express + TypeScript

## 快速开始

### 1. 后端配置

```bash
cd backend
npm install
cp .env.example .env  # 复制环境变量模板
```

编辑 `.env` 文件，填入 API 密钥：

```env
PORT=3001
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-key
```

获取 DeepSeek API 密钥: https://platform.deepseek.com/

启动后端：

```bash
npm run dev
```

### 2. 前端启动

```bash
cd frontend
npm install
npm run dev
```

## 使用说明

1. 上传文件（支持 .txt, .csv, .json）
2. 输入清洗指令（自然语言）
3. 确认 AI 生成的策略
4. 执行清洗并下载结果

## 支持的清洗操作

- 删除空行、去重
- 长度过滤
- 删除 URL、HTML 标签
- 删除特殊字符
- 标准化空白字符
- 语言过滤
- 关键词过滤
