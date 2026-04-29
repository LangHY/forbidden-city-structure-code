/**
 * config.test.ts - Exhibition 配置数据完整性测试
 *
 * 验证章节数据、模型映射、装饰文字等配置的一致性
 */

import { describe, it, expect } from 'vitest'
import {
  chapters,
  chapterModelMap,
  decorativeChars,
  dougongComponents,
} from '@/components/exhibition/config'

describe('章节配置 (chapters)', () => {
  it('应包含 23 种斗拱类型', () => {
    expect(chapters).toHaveLength(23)
  })

  it('每个章节应有唯一的 id', () => {
    const ids = chapters.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('每个章节应有非空的 label', () => {
    chapters.forEach(chapter => {
      expect(chapter.label).toBeTruthy()
      expect(typeof chapter.label).toBe('string')
    })
  })

  it('所有章节 id 应使用 kebab-case 命名', () => {
    const kebabPattern = /^[a-z]+(-[a-z0-9]+)*$/
    chapters.forEach(chapter => {
      expect(chapter.id).toMatch(kebabPattern)
    })
  })
})

describe('模型映射 (chapterModelMap)', () => {
  it('应覆盖所有章节', () => {
    const chapterIds = chapters.map(c => c.id)
    const mappedIds = Object.keys(chapterModelMap)

    for (const id of chapterIds) {
      expect(mappedIds).toContain(id)
    }
  })

  it('不应有不存在的章节引用', () => {
    const chapterIds = new Set(chapters.map(c => c.id))
    const mappedIds = Object.keys(chapterModelMap)

    for (const id of mappedIds) {
      expect(chapterIds.has(id)).toBe(true)
    }
  })

  it('所有模型 ID 应遵循 RxLy 格式', () => {
    const modelPattern = /^R\d+L\d+$/

    Object.entries(chapterModelMap).forEach(([chapterId, modelId]) => {
      expect(modelId).toMatch(modelPattern)
    })
  })
})

describe('装饰文字映射 (decorativeChars)', () => {
  it('应覆盖所有章节', () => {
    const chapterIds = chapters.map(c => c.id)
    const decoratedIds = Object.keys(decorativeChars)

    for (const id of chapterIds) {
      expect(decoratedIds).toContain(id)
    }
  })

  it('装饰文字应与章节 label 匹配', () => {
    chapters.forEach(chapter => {
      const decoration = decorativeChars[chapter.id]
      expect(decoration).toBe(chapter.label)
    })
  })
})

describe('斗拱组件 (dougongComponents)', () => {
  it('应包含至少 3 种基础构件', () => {
    expect(dougongComponents.length).toBeGreaterThanOrEqual(3)
  })

  it('每个构件应有完整的字段', () => {
    dougongComponents.forEach(comp => {
      expect(comp.id).toBeTruthy()
      expect(comp.name).toBeTruthy()
      expect(comp.nameEn).toBeTruthy()
      expect(comp.desc).toBeTruthy()
    })
  })

  it('构件 id 应唯一', () => {
    const ids = dougongComponents.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})
