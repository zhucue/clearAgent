import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import type { CleaningStrategy, FileStats, LLMProvider } from '../types/index.js'
import { SYSTEM_PROMPT, buildAnalysisPrompt } from '../prompts/system.prompt.js'

export class LLMService {
  private openaiClient?: OpenAI
  private anthropicClient?: Anthropic
  private deepseekClient?: OpenAI
  private provider: LLMProvider

  constructor(provider: LLMProvider = 'deepseek', apiKey?: string) {
    this.provider = provider

    if (provider === 'openai') {
      this.openaiClient = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
      })
    } else if (provider === 'anthropic') {
      this.anthropicClient = new Anthropic({
        apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
      })
    } else if (provider === 'deepseek') {
      this.deepseekClient = new OpenAI({
        apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      })
    }
  }

  /**
   * 核心方法：分析语料并生成清洗策略
   */
  async analyzeAndGenerateStrategy(
    userCommand: string,
    fileSample: string,
    fileStats: FileStats
  ): Promise<CleaningStrategy> {
    const prompt = buildAnalysisPrompt(userCommand, fileSample, fileStats)

    let strategyJson: string

    if (this.provider === 'openai' && this.openaiClient) {
      strategyJson = await this.callOpenAI(prompt)
    } else if (this.provider === 'anthropic' && this.anthropicClient) {
      strategyJson = await this.callAnthropic(prompt)
    } else if (this.provider === 'deepseek' && this.deepseekClient) {
      strategyJson = await this.callDeepSeek(prompt)
    } else {
      throw new Error(`Unsupported LLM provider: ${this.provider}`)
    }

    // 解析JSON
    try {
      const strategy: CleaningStrategy = JSON.parse(strategyJson)
      return strategy
    } catch (error) {
      console.error('Failed to parse LLM response:', strategyJson)
      throw new Error('LLM返回的JSON格式无效')
    }
  }

  /**
   * 调用OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized')
    }

    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4o-mini', // 性价比最高的模型
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    })

    return response.choices[0].message.content || '{}'
  }

  /**
   * 调用Anthropic Claude API
   */
  private async callAnthropic(prompt: string): Promise<string> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not initialized')
    }

    const response = await this.anthropicClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\n${prompt}\n\n请返回JSON格式的策略，不要包含markdown标记。`,
        },
      ],
    })

    const content = response.content[0]
    let text = content.type === 'text' ? content.text : '{}'

    // 提取JSON（Claude可能返回带markdown的内容）
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? jsonMatch[0] : text
  }

  /**
   * 调用DeepSeek API
   */
  private async callDeepSeek(prompt: string): Promise<string> {
    if (!this.deepseekClient) {
      throw new Error('DeepSeek client not initialized')
    }

    const response = await this.deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    })

    return response.choices[0].message.content || '{}'
  }

  /**
   * 切换LLM提供商
   */
  switchProvider(provider: LLMProvider, apiKey?: string) {
    this.provider = provider

    if (provider === 'openai') {
      this.openaiClient = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
      })
    } else if (provider === 'anthropic') {
      this.anthropicClient = new Anthropic({
        apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
      })
    } else if (provider === 'deepseek') {
      this.deepseekClient = new OpenAI({
        apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      })
    }
  }
}

