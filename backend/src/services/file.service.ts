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

    // 读取第一个工作表
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 将工作表转换为CSV格式，然后分割成行
    const csv = xlsx.utils.sheet_to_csv(worksheet)
    return csv.split('\n').filter(line => line.trim() !== '')
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
  async writeFileLines(filePath: string, lines: string[], originalFilePath?: string): Promise<void> {
    // 如果指定了原始文件路径且是 Excel 文件，则输出为 Excel 格式
    if (originalFilePath && this.isExcelFile(originalFilePath)) {
      this.writeExcelFile(filePath, lines)
      return
    }

    // 默认写入为文本文件
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
   * 将数据写入 Excel 文件
   * 从 CSV 格式的数据重新构建 Excel 表格
   */
  private writeExcelFile(filePath: string, lines: string[]): void {
    // 将 CSV 格式的行转换为二维数组
    const data: string[][] = []
    for (const line of lines) {
      // 简单的 CSV 解析（处理逗号分隔）
      const row = this.parseCSVLine(line)
      data.push(row)
    }

    // 创建工作簿和工作表
    const worksheet = xlsx.utils.aoa_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // 确保输出目录存在
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // 写入 Excel 文件（.xlsx 格式）
    const xlsxPath = filePath.replace(/\.txt$/i, '.xlsx')
    xlsx.writeFile(workbook, xlsxPath)
  }

  /**
   * 简单的 CSV 行解析
   */
  private parseCSVLine(line: string): string[] {
    // 处理带引号的 CSV 字段
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)

    return result
  }

  /**
   * 获取Excel文件预览数据（返回JSON格式用于前端表格展示）
   */
  getExcelPreview(filePath: string, maxRows: number = 20): {
    headers: string[]
    rows: string[][]
    totalRows: number
  } {
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 获取工作表数据（二维数组格式）
    const data = xlsx.utils.sheet_to_json<string[]>(worksheet, { header: 1 })

    if (data.length === 0) {
      return { headers: [], rows: [], totalRows: 0 }
    }

    // 第一行作为表头
    const headers = data[0] || []

    // 其余行作为数据行（最多返回maxRows行）
    const rows = data.slice(1, maxRows + 1).map(row => row || [])

    return {
      headers,
      rows,
      totalRows: data.length - 1, // 减去表头行
    }
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

