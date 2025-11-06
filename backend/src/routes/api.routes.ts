import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { LLMService } from '../services/llm.service.js'
import { FileService } from '../services/file.service.js'
import { CleanerService } from '../services/cleaner.service.js'
import { config } from '../config/env.js'
import type { CleaningStrategy } from '../types/index.js'

const router = express.Router()

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = config.upload.uploadDir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.txt', '.csv', '.json']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('只支持 .txt, .csv, .json 格式的文件'))
    }
  },
})

// 初始化服务
const llmService = new LLMService(config.llm.provider)
const fileService = new FileService()
const cleanerService = new CleanerService()

/**
 * POST /api/analyze
 * 分析语料并生成清洗策略
 */
router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' })
    }

    const { command } = req.body
    if (!command) {
      return res.status(400).json({ error: '请提供清洗指令' })
    }

    const filePath = req.file.path
    const fileId = path.basename(filePath)

    console.log(`📁 Analyzing file: ${fileId}`)
    console.log(`💬 User command: ${command}`)

    // 获取文件统计信息
    const stats = await fileService.getFileStats(filePath)
    console.log(`📊 File stats:`, stats)

    // 获取文件采样
    const sample = await fileService.getFileSample(filePath, 100)

    // 调用LLM生成策略
    console.log(`🤖 Calling LLM to generate strategy...`)
    const strategy = await llmService.analyzeAndGenerateStrategy(command, sample, stats)
    console.log(`✅ Strategy generated:`, strategy)

    res.json({
      fileId,
      filePath,
      stats,
      strategy,
    })
  } catch (error: any) {
    console.error('❌ Error in /api/analyze:', error)
    res.status(500).json({
      error: '分析失败',
      message: error.message,
    })
  }
})

/**
 * POST /api/execute
 * 执行清洗策略
 */
router.post('/execute', async (req, res) => {
  try {
    const { filePath, strategy } = req.body as {
      filePath: string
      strategy: CleaningStrategy
    }

    if (!filePath || !strategy) {
      return res.status(400).json({ error: '缺少必要参数' })
    }

    // 验证文件存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' })
    }

    // 生成输出文件路径
    const outputDir = config.upload.outputDir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const timestamp = Date.now()
    const outputFileName = `cleaned-${timestamp}.txt`
    const outputFilePath = path.join(outputDir, outputFileName)

    console.log(`🔧 Executing cleaning strategy...`)
    console.log(`📥 Input: ${filePath}`)
    console.log(`📤 Output: ${outputFilePath}`)

    // 执行清洗
    const result = await cleanerService.executeCleaning(filePath, outputFilePath, strategy)

    console.log(`✅ Cleaning completed:`, result.stats)

    res.json(result)
  } catch (error: any) {
    console.error('❌ Error in /api/execute:', error)
    res.status(500).json({
      error: '执行失败',
      message: error.message,
    })
  }
})

/**
 * GET /api/download/:filename
 * 下载清洗结果
 */
router.get('/download/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(config.upload.outputDir, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' })
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('❌ Error downloading file:', err)
        res.status(500).json({ error: '下载失败' })
      }
    })
  } catch (error: any) {
    console.error('❌ Error in /api/download:', error)
    res.status(500).json({
      error: '下载失败',
      message: error.message,
    })
  }
})

/**
 * GET /api/cleaners
 * 获取支持的清洗器列表
 */
router.get('/cleaners', (req, res) => {
  const cleaners = cleanerService.getSupportedCleaners()
  res.json({ cleaners })
})

export default router

