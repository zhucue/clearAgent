import type { FileStats } from '../types/index.js'

export const SYSTEM_PROMPT = `你是一个专业的数据清洗专家AI助手。
你的任务是：
1. 理解用户对语料文件的清洗需求
2. 分析文件内容，发现数据质量问题
3. 生成结构化的清洗策略JSON

你必须返回有效的JSON格式，不要包含任何markdown标记或其他文字。`

export function buildAnalysisPrompt(
  userCommand: string,
  fileSample: string,
  fileStats: FileStats
): string {
  return `用户上传了一个语料文件，需要进行清洗。

【文件统计信息】
- 总行数: ${fileStats.totalLines}
- 总字符数: ${fileStats.totalChars}
- 文件大小: ${fileStats.fileSize}
- 编码: ${fileStats.encoding}
- 平均行长度: ${fileStats.avgLineLength} 字符
${fileStats.emptyLines !== undefined ? `- 空行数: ${fileStats.emptyLines}` : ''}
${fileStats.duplicateLines !== undefined ? `- 重复行数: ${fileStats.duplicateLines}` : ''}

【文件内容采样（前100行）】
\`\`\`
${fileSample}
\`\`\`

【用户清洗指令】
${userCommand}

请分析文件内容和用户需求，生成一个清洗策略JSON。

返回格式：
{
  "analysis": "对文件的分析和发现的问题（2-3句话）",
  "tasks": [
    {
      "type": "清洗类型",
      "params": {},
      "priority": 1,
      "description": "该步骤的说明"
    }
  ],
  "estimatedResult": {
    "expectedLines": 预估清洗后的行数,
    "removalRate": 预估删除比例（0-100）
  }
}

支持的清洗类型（type）：
- remove_empty_lines: 删除空行
- deduplicate: 去重，params: { method: "exact" | "fuzzy" }
- filter_by_length: 按长度过滤，params: { min_len: 数字, max_len: 数字 }
- remove_urls: 删除URL链接
- remove_html: 删除HTML标签
- remove_special_chars: 删除特殊字符，params: { pattern: "正则表达式字符串" }
- normalize_whitespace: 标准化空白字符
- filter_by_language: 按语言过滤，params: { lang: "zh" | "en" }
- filter_by_keywords: 关键词过滤，params: { blacklist: ["词1", "词2"] }

注意：
1. priority从1开始，数字越小优先级越高
2. 根据文件实际情况智能推荐清洗步骤
3. 只返回JSON，不要包含其他文字或markdown标记
4. estimatedResult中的expectedLines应该是合理的预估值
5. removalRate是删除比例，范围0-100`
}

