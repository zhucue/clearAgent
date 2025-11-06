import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { config, validateConfig } from './config/env.js'
import apiRoutes from './routes/api.routes.js'

const app = express()

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

// 确保上传和输出目录存在
if (!fs.existsSync(config.upload.uploadDir)) {
  fs.mkdirSync(config.upload.uploadDir, { recursive: true })
}
if (!fs.existsSync(config.upload.outputDir)) {
  fs.mkdirSync(config.upload.outputDir, { recursive: true })
}

// API路由
app.use('/api', apiRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    provider: config.llm.provider,
  })
})

// 根路径
app.get('/', (req, res) => {
  res.json({
    name: 'AI Corpus Cleaner API',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/analyze',
      execute: 'POST /api/execute',
      download: 'GET /api/download/:filename',
      cleaners: 'GET /api/cleaners',
      health: 'GET /health',
    },
  })
})

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err)
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
  })
})

// 启动服务器
const PORT = config.port

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 AI Corpus Cleaner Backend Server')
  console.log('='.repeat(60))
  console.log(`📡 Server running on: http://localhost:${PORT}`)
  console.log(`🤖 LLM Provider: ${config.llm.provider}`)
  console.log(`📁 Upload directory: ${config.upload.uploadDir}`)
  console.log(`📤 Output directory: ${config.upload.outputDir}`)
  console.log('='.repeat(60) + '\n')

  // 验证配置
  validateConfig()
})

export default app

