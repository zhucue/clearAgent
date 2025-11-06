import * as fs from 'fs'
import * as readline from 'readline'
import type { FileStats } from '../types/index.js'

export class FileService {
  /**
   * 获取文件统计信息
   */
  async getFileStats(filePath: string): Promise<FileStats> {
    const fileSize = fs.statSync(filePath).size
    const lines = await this.readFileLines(filePath)

    const totalLines = lines.length
    const emptyLines = lines.filter((line) => line.trim() === '').length
    const uniqueLines = new Set(lines).size
    const duplicateLines = totalLines - uniqueLines

    const totalChars = lines.reduce((sum, line) => sum + line.length, 0)
    const avgLineLength = totalLines > 0 ? Math.round(totalChars / totalLines) : 0

    return {
      totalLines,
      totalChars,
      fileSize: this.formatFileSize(fileSize),
      encoding: 'utf-8',
      avgLineLength,
      emptyLines,
      duplicateLines,
    }
  }

  /**
   * 获取文件采样（前N行）
   */
  async getFileSample(filePath: string, maxLines: number = 100): Promise<string> {
    const lines: string[] = []
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' })
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    let count = 0
    for await (const line of rl) {
      if (count >= maxLines) break
      lines.push(line)
      count++
    }

    return lines.join('\n')
  }

  /**
   * 读取文件所有行
   */
  async readFileLines(filePath: string): Promise<string[]> {
    const lines: string[] = []
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' })
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    for await (const line of rl) {
      lines.push(line)
    }

    return lines
  }

  /**
   * 写入文件
   */
  async writeFileLines(filePath: string, lines: string[]): Promise<void> {
    const writeStream = fs.createWriteStream(filePath, { encoding: 'utf-8' })

    for (const line of lines) {
      writeStream.write(line + '\n')
    }

    writeStream.end()

    return new Promise((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })
  }

  /**
   * 格式化文件大小
   */
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  /**
   * 确保目录存在
   */
  ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  }
}

