import type { BaseCleaner } from './base.cleaner.js'
import {
  RemoveEmptyLinesCleaner,
  DeduplicateCleaner,
  FilterByLengthCleaner,
  RemoveUrlsCleaner,
  RemoveHtmlCleaner,
  RemoveSpecialCharsCleaner,
  NormalizeWhitespaceCleaner,
  FilterByLanguageCleaner,
  FilterByKeywordsCleaner,
} from './implementations.js'

/**
 * 清洗器注册表
 */
export class CleanerRegistry {
  private cleaners: Map<string, BaseCleaner> = new Map()

  constructor() {
    this.registerDefaultCleaners()
  }

  /**
   * 注册默认清洗器
   */
  private registerDefaultCleaners() {
    const defaultCleaners = [
      new RemoveEmptyLinesCleaner(),
      new DeduplicateCleaner(),
      new FilterByLengthCleaner(),
      new RemoveUrlsCleaner(),
      new RemoveHtmlCleaner(),
      new RemoveSpecialCharsCleaner(),
      new NormalizeWhitespaceCleaner(),
      new FilterByLanguageCleaner(),
      new FilterByKeywordsCleaner(),
    ]

    for (const cleaner of defaultCleaners) {
      this.register(cleaner)
    }
  }

  /**
   * 注册清洗器
   */
  register(cleaner: BaseCleaner) {
    this.cleaners.set(cleaner.getName(), cleaner)
  }

  /**
   * 获取清洗器
   */
  get(name: string): BaseCleaner | undefined {
    return this.cleaners.get(name)
  }

  /**
   * 获取所有清洗器名称
   */
  getAllNames(): string[] {
    return Array.from(this.cleaners.keys())
  }
}

