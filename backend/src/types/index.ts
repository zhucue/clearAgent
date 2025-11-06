// 文件统计信息
export interface FileStats {
  totalLines: number
  totalChars: number
  fileSize: string
  encoding: string
  avgLineLength: number
  emptyLines?: number
  duplicateLines?: number
}

// 清洗任务
export interface CleaningTask {
  type: string
  params?: Record<string, any>
  priority: number
  description: string
}

// 清洗策略
export interface CleaningStrategy {
  analysis: string
  tasks: CleaningTask[]
  estimatedResult: {
    expectedLines: number
    removalRate: number
  }
}

// 清洗结果
export interface CleaningResult {
  success: boolean
  outputFile: string
  outputPath: string
  stats: {
    originalLines: number
    finalLines: number
    removedLines: number
    originalChars: number
    finalChars: number
    removedChars: number
    charRemovalRate: number
  }
  executionTime: number
}

// LLM提供商类型
export type LLMProvider = 'openai' | 'anthropic' | 'deepseek' | 'zhipu'

