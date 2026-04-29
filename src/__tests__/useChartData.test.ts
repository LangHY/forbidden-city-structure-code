/**
 * useChartData.test.ts - 数据加载与解析函数测试
 *
 * 测试 parseTreeData、aggregateSankeyData、parseSankeyData 等纯函数
 */

import { describe, it, expect } from 'vitest'
import {
  parseTreeData,
  aggregateSankeyData,
  parseSankeyData,
  FUNCTION_CATEGORIES,
} from '@/hooks/useChartData'

describe('parseTreeData', () => {
  it('空数组应返回默认根节点', () => {
    const result = parseTreeData([])
    expect(result).toEqual({ name: 'root', children: [] })
  })

  it('单根节点应正确构建', () => {
    const data = [
      { name: '斗拱', parent: null, value: 100, description: '顶部结构' },
    ]
    const result = parseTreeData(data)
    expect(result.name).toBe('斗拱')
    expect(result.value).toBe(100)
    expect(result.description).toBe('顶部结构')
    expect(result.children).toEqual([])
  })

  it('两级树应正确构建父子关系', () => {
    const data = [
      { name: '斗拱', parent: null, value: 100, description: '根' },
      { name: '栌斗', parent: '斗拱', value: 50, description: '底座' },
      { name: '横拱', parent: '斗拱', value: 30, description: '横向' },
    ]
    const result = parseTreeData(data)
    expect(result.name).toBe('斗拱')
    expect(result.children).toHaveLength(2)

    const childNames = result.children.map((c: { name: string }) => c.name)
    expect(childNames).toContain('栌斗')
    expect(childNames).toContain('横拱')
  })

  it('三级嵌套树应正确构建', () => {
    const data = [
      { name: '斗拱', parent: null, value: null, description: '根' },
      { name: '栌斗', parent: '斗拱', value: 50, description: '一级' },
      { name: '齐心斗', parent: '栌斗', value: 25, description: '二级' },
    ]
    const result = parseTreeData(data)
    expect(result.children).toHaveLength(1)
    expect(result.children[0].name).toBe('栌斗')
    expect(result.children[0].children).toHaveLength(1)
    expect(result.children[0].children[0].name).toBe('齐心斗')
  })

  it('孤儿节点应被忽略（父节点不存在）', () => {
    const data = [
      { name: '斗拱', parent: null, value: null, description: '根' },
      { name: '孤立节点', parent: '不存在的父节点', value: 10, description: '' },
    ]
    const result = parseTreeData(data)
    expect(result.name).toBe('斗拱')
    expect(result.children).toHaveLength(0)
  })

  it('无 value 的节点 value 应为 undefined', () => {
    const data = [
      { name: '根', parent: null, value: null, description: '' },
    ]
    const result = parseTreeData(data)
    expect(result.value).toBeUndefined()
  })

  it('description 应正确传递', () => {
    const data = [
      { name: '根', parent: null, value: 1, description: '描述信息' },
    ]
    const result = parseTreeData(data)
    expect(result.description).toBe('描述信息')
  })
})

describe('aggregateSankeyData', () => {
  it('应只保留核心宫殿', () => {
    const rawData = [
      { source: '太和殿', target: '朝会大典', value: '10' },
      { source: '御花园', target: '日常休憩', value: '5' },
      { source: '午门', target: '宫门正门', value: '8' },
    ]
    const result = aggregateSankeyData(rawData)

    const sources = result.map(r => r.source)
    expect(sources).toContain('太和殿')
    expect(sources).toContain('午门')
    expect(sources).not.toContain('御花园')
  })

  it('应将细分功能归类到6大类别', () => {
    const rawData = [
      { source: '太和殿', target: '朝会大典', value: '10' },
      { source: '太和殿', target: '皇帝登基', value: '5' },
    ]
    const result = aggregateSankeyData(rawData)

    const categories = result.filter(r => r.source === '太和殿')
    expect(categories.length).toBeGreaterThanOrEqual(1)

    const categoryNames = categories.map(r => r.target)
    expect(categoryNames).toContain('朝会典礼')
  })

  it('应正确聚合相同来源和目标的权重', () => {
    const rawData = [
      { source: '太和殿', target: '朝会大典', value: '10' },
      { source: '太和殿', target: '皇帝登基', value: '5' },
      { source: '太和殿', target: '千叟宴', value: '3' },
    ]

    const result = aggregateSankeyData(rawData)

    const taiheCategories = result.filter(r => r.source === '太和殿')
    expect(taiheCategories.length).toBe(1)
    expect(taiheCategories[0].target).toBe('朝会典礼')
    expect(parseInt(taiheCategories[0].value)).toBeGreaterThan(0)
  })

  it('value 应为有效的数字字符串', () => {
    const rawData = [
      { source: '乾清宫', target: '皇帝办公', value: '7' },
    ]
    const result = aggregateSankeyData(rawData)

    for (const item of result) {
      const num = parseInt(item.value, 10)
      expect(Number.isNaN(num)).toBe(false)
      expect(num).toBeGreaterThan(0)
    }
  })

  it('空数据应返回空数组', () => {
    const result = aggregateSankeyData([])
    expect(result).toEqual([])
  })
})

describe('parseSankeyData', () => {
  it('应将数据转换为节点和链接格式', () => {
    const csvData = [
      { source: '太和殿', target: '朝会典礼', value: '10' },
      { source: '太和殿', target: '重要典礼', value: '5' },
    ]
    const result = parseSankeyData(csvData)

    expect(result.nodes.length).toBeGreaterThanOrEqual(2)
    expect(result.links).toHaveLength(2)

    const nodeNames = result.nodes.map(n => n.name)
    expect(nodeNames).toContain('太和殿')
    expect(nodeNames).toContain('朝会典礼')
    expect(nodeNames).toContain('重要典礼')
  })

  it('链接的 value 应为数字类型', () => {
    const csvData = [
      { source: '太和殿', target: '朝会典礼', value: '10' },
    ]
    const result = parseSankeyData(csvData)

    expect(typeof result.links[0].value).toBe('number')
    expect(result.links[0].value).toBe(10)
  })

  it('节点应去重', () => {
    const csvData = [
      { source: '太和殿', target: '朝会典礼', value: '10' },
      { source: '太和殿', target: '重要典礼', value: '5' },
    ]
    const result = parseSankeyData(csvData)

    const taiheCount = result.nodes.filter(n => n.name === '太和殿')
    expect(taiheCount).toHaveLength(1)
  })

  it('空数据应返回空结果', () => {
    const result = parseSankeyData([])
    expect(result.nodes).toEqual([])
    expect(result.links).toEqual([])
  })
})

describe('FUNCTION_CATEGORIES', () => {
  it('应包含6大类别', () => {
    const categories = new Set(Object.values(FUNCTION_CATEGORIES))
    expect(categories.size).toBe(6)
    expect(categories.has('朝会典礼')).toBe(true)
    expect(categories.has('日常政务')).toBe(true)
    expect(categories.has('重要典礼')).toBe(true)
    expect(categories.has('居住生活')).toBe(true)
    expect(categories.has('祭祀宗教')).toBe(true)
    expect(categories.has('日常出入')).toBe(true)
  })

  it('不应有空的映射值', () => {
    Object.entries(FUNCTION_CATEGORIES).forEach(([key, value]) => {
      expect(value).toBeTruthy()
    })
  })
})
