import * as fs from 'fs'
import * as readline from 'readline'
import xlsx from 'xlsx'
import * as path from 'path'
import type { FileStats } from '../types/index.js'

export class FileService {
  /**
   * 检查是否为Excel文件
   */
  private isExcelFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase()
    return ext === '.xlsx' || ext === '.xls'
  }

  /**
   * 将Excel文件转换为文本行数组
   */
  private readExcelFile(filePath: string): string[] {
    const workbook = xlsx.readFile(filePath)
    const lines: string[] = []

    // 读取第一个工作表
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 将工作表转换为CSV格式，然后分割成行
    const csv = xlsx.utils.sheet_to_csv(worksheet)
    const rows = csv.split('\n').filter(line => line.trim() !== '')

    return rows
  }

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
    // 如果是Excel文件，直接读取并截取前N行
    if (this.isExcelFile(filePath)) {
      const allLines = this.readExcelFile(filePath)
      const sampleLines = allLines.slice(0, maxLines)
      return sampleLines.join('\n')
    }

    // 否则使用传统的逐行读取方式
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
    // 如果是Excel文件，使用Excel读取方法
    if (this.isExcelFile(filePath)) {
      return this.readExcelFile(filePath)
    }

    // 否则使用传统的逐行读取方式
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

