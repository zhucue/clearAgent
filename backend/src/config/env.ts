import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 3001,

  llm: {
    provider: (process.env.LLM_PROVIDER || 'deepseek') as 'openai' | 'anthropic' | 'deepseek',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
    zhipuApiKey: process.env.ZHIPU_API_KEY || '',
    qwenApiKey: process.env.QWEN_API_KEY || '',
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB
    uploadDir: 'uploads',
    outputDir: 'outputs',
  },
}

// 验证必需的环境变量
export function validateConfig() {
  const { provider, openaiApiKey, anthropicApiKey, deepseekApiKey } = config.llm

  if (provider === 'openai' && !openaiApiKey) {
    console.warn('⚠️  Warning: OPENAI_API_KEY is not set')
  }

  if (provider === 'anthropic' && !anthropicApiKey) {
    console.warn('⚠️  Warning: ANTHROPIC_API_KEY is not set')
  }

  if (provider === 'deepseek' && !deepseekApiKey) {
    console.warn('⚠️  Warning: DEEPSEEK_API_KEY is not set')
  }
}

