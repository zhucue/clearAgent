import path from 'path'
import type { CleaningStrategy, CleaningResult } from '../types/index.js'
import { CleanerRegistry } from '../cleaners/index.js'
import { FileService } from './file.service.js'

export class CleanerService {
  private registry: CleanerRegistry
  private fileService: FileService

  constructor() {
    this.registry = new CleanerRegistry()
    this.fileService = new FileService()
  }

  /**
   * 执行清洗策略
   */
  async executeCleaning(
    inputFilePath: string,
    outputFilePath: string,
    strategy: CleaningStrategy
  ): Promise<CleaningResult> {
    const startTime = Date.now()

    // 读取文件
    let lines = await this.fileService.readFileLines(inputFilePath)
    const originalLines = lines.length
    const originalChars = lines.reduce((sum, line) => sum + line.length, 0)

    console.log(`📊 Original file: ${originalLines} lines, ${originalChars} characters`)

    // 按优先级排序任务
    const sortedTasks = [...strategy.tasks].sort((a, b) => a.priority - b.priority)

    // 依次执行清洗任务
    for (const task of sortedTasks) {
      const cleaner = this.registry.get(task.type)

      if (!cleaner) {
        console.warn(`⚠️  Unknown cleaner type: ${task.type}, skipping...`)
        continue
      }

      console.log(`🔧 Executing: ${task.description}`)
      lines = cleaner.clean(lines, task.params)
      const currentChars = lines.reduce((sum, line) => sum + line.length, 0)
      console.log(`   Result: ${lines.length} lines, ${currentChars} characters`)
    }

    // 写入结果文件
    await this.fileService.writeFileLines(outputFilePath, lines)

    const finalLines = lines.length
    const finalChars = lines.reduce((sum, line) => sum + line.length, 0)
    const removedLines = originalLines - finalLines
    const removedChars = originalChars - finalChars
    const charRemovalRate = originalChars > 0 ? (removedChars / originalChars) * 100 : 0
    const executionTime = (Date.now() - startTime) / 1000

    return {
      success: true,
      outputFile: path.basename(outputFilePath),
      outputPath: outputFilePath,
      stats: {
        originalLines,
        finalLines,
        removedLines,
        originalChars,
        finalChars,
        removedChars,
        charRemovalRate: parseFloat(charRemovalRate.toFixed(2)),
      },
      executionTime: parseFloat(executionTime.toFixed(2)),
    }
  }

  /**
   * 获取支持的清洗器列表
   */
  getSupportedCleaners(): string[] {
    return this.registry.getAllNames()
  }
}

