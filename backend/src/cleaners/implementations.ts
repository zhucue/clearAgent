import { BaseCleaner } from './base.cleaner.js'

/**
 * 删除空行
 */
export class RemoveEmptyLinesCleaner extends BaseCleaner {
  getName(): string {
    return 'remove_empty_lines'
  }

  clean(lines: string[]): string[] {
    return lines.filter((line) => line.trim() !== '')
  }
}

/**
 * 去重
 */
export class DeduplicateCleaner extends BaseCleaner {
  getName(): string {
    return 'deduplicate'
  }

  clean(lines: string[], params?: { method?: 'exact' | 'fuzzy' }): string[] {
    const method = params?.method || 'exact'

    if (method === 'exact') {
      return [...new Set(lines)]
    } else {
      // 模糊去重：基于相似度
      const result: string[] = []
      const seen = new Set<string>()

      for (const line of lines) {
        const normalized = line.trim().toLowerCase()
        if (!seen.has(normalized)) {
          seen.add(normalized)
          result.push(line)
        }
      }

      return result
    }
  }
}

/**
 * 按长度过滤
 */
export class FilterByLengthCleaner extends BaseCleaner {
  getName(): string {
    return 'filter_by_length'
  }

  clean(lines: string[], params?: { min_len?: number; max_len?: number }): string[] {
    const minLen = params?.min_len ?? 0
    const maxLen = params?.max_len ?? Infinity

    return lines.filter((line) => {
      const len = line.trim().length
      return len >= minLen && len <= maxLen
    })
  }
}

/**
 * 删除URL
 */
export class RemoveUrlsCleaner extends BaseCleaner {
  getName(): string {
    return 'remove_urls'
  }

  clean(lines: string[]): string[] {
    const urlPattern = /https?:\/\/[^\s]+/g
    return lines.map((line) => line.replace(urlPattern, '').trim()).filter((line) => line !== '')
  }
}

/**
 * 删除HTML标签
 */
export class RemoveHtmlCleaner extends BaseCleaner {
  getName(): string {
    return 'remove_html'
  }

  clean(lines: string[]): string[] {
    const htmlPattern = /<[^>]*>/g
    return lines.map((line) => line.replace(htmlPattern, '').trim()).filter((line) => line !== '')
  }
}

/**
 * 删除特殊字符
 */
export class RemoveSpecialCharsCleaner extends BaseCleaner {
  getName(): string {
    return 'remove_special_chars'
  }

  clean(lines: string[], params?: { pattern?: string }): string[] {
    const pattern = params?.pattern || '[^a-zA-Z0-9\\u4e00-\\u9fa5\\s]'
    const regex = new RegExp(pattern, 'g')

    return lines.map((line) => line.replace(regex, '').trim()).filter((line) => line !== '')
  }
}

/**
 * 标准化空白字符
 */
export class NormalizeWhitespaceCleaner extends BaseCleaner {
  getName(): string {
    return 'normalize_whitespace'
  }

  clean(lines: string[]): string[] {
    return lines.map((line) => line.replace(/\s+/g, ' ').trim()).filter((line) => line !== '')
  }
}

/**
 * 按语言过滤
 */
export class FilterByLanguageCleaner extends BaseCleaner {
  getName(): string {
    return 'filter_by_language'
  }

  clean(lines: string[], params?: { lang?: 'zh' | 'en' }): string[] {
    const lang = params?.lang || 'zh'

    if (lang === 'zh') {
      // 保留包含中文的行
      const chinesePattern = /[\u4e00-\u9fa5]/
      return lines.filter((line) => chinesePattern.test(line))
    } else if (lang === 'en') {
      // 保留包含英文的行
      const englishPattern = /[a-zA-Z]/
      return lines.filter((line) => englishPattern.test(line))
    }

    return lines
  }
}

/**
 * 关键词过滤
 */
export class FilterByKeywordsCleaner extends BaseCleaner {
  getName(): string {
    return 'filter_by_keywords'
  }

  clean(lines: string[], params?: { blacklist?: string[] }): string[] {
    const blacklist = params?.blacklist || []

    return lines.filter((line) => {
      return !blacklist.some((keyword) => line.includes(keyword))
    })
  }
}

