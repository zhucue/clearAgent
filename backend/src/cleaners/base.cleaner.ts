/**
 * 清洗器基类
 */
export abstract class BaseCleaner {
  abstract clean(lines: string[], params?: Record<string, any>): string[]

  /**
   * 获取清洗器名称
   */
  abstract getName(): string
}

