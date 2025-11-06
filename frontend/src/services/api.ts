import axios, { AxiosError } from 'axios'
import type { AnalyzeResponse, CleaningStrategy, CleaningResult } from '@/types'

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5分钟超时（处理大文件）
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as any)?.error || error.message || '请求失败'
    throw new Error(message)
  }
)

/**
 * 分析语料文件并生成清洗策略
 */
export async function analyzeCorpus(
  file: File,
  command: string
): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('command', command)

  const response = await apiClient.post<AnalyzeResponse>('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

/**
 * 执行清洗策略
 */
export async function executeCleaning(
  filePath: string,
  strategy: CleaningStrategy
): Promise<CleaningResult> {
  const response = await apiClient.post<CleaningResult>('/execute', {
    filePath,
    strategy,
  })

  return response.data
}

/**
 * 下载清洗结果
 */
export async function downloadResult(filename: string): Promise<void> {
  try {
    const response = await apiClient.get(`/download/${filename}`, {
      responseType: 'blob',
    })

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    // 清理
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载失败:', error)
    throw error
  }
}

export default apiClient

