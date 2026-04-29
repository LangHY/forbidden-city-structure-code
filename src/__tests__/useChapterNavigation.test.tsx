/**
 * useChapterNavigation.test.tsx - 章节导航 Hook 测试
 *
 * 测试章节切换逻辑、边界条件、动画锁机制
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChapterNavigation } from '@/components/exhibition/hooks/useChapterNavigation'
import { chapters } from '@/components/exhibition/config'

describe('useChapterNavigation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初始状态应为第一个章节', () => {
    const { result } = renderHook(() => useChapterNavigation())

    expect(result.current.activeChapter).toBe(chapters[0].id)
    expect(result.current.slideDirection).toBeNull()
    expect(result.current.isAnimating).toBe(false)
  })

  it('goNext 应切换到下一个章节', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.goNext()
    })

    expect(result.current.activeChapter).toBe(chapters[1].id)
    expect(result.current.slideDirection).toBe('down')
  })

  it('goPrev 应切换到上一个章节', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.goNext()
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    act(() => {
      const success = result.current.goPrev()
      expect(success).toBe(true)
    })

    expect(result.current.activeChapter).toBe(chapters[0].id)
    expect(result.current.slideDirection).toBe('up')
  })

  it('在第一个章节 goPrev 应返回 false', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      const success = result.current.goPrev()
      expect(success).toBe(false)
    })

    expect(result.current.activeChapter).toBe(chapters[0].id)
  })

  it('在最后一个章节 goNext 应返回 false', () => {
    const { result } = renderHook(() => useChapterNavigation())

    const lastIndex = chapters.length - 1

    for (let i = 0; i < lastIndex; i++) {
      act(() => {
        result.current.goNext()
      })
      act(() => {
        vi.advanceTimersByTime(500)
      })
    }

    expect(result.current.activeChapter).toBe(chapters[lastIndex].id)

    act(() => {
      const success = result.current.goNext()
      expect(success).toBe(false)
    })

    expect(result.current.activeChapter).toBe(chapters[lastIndex].id)
  })

  it('goToChapter 应跳转到指定章节', () => {
    const { result } = renderHook(() => useChapterNavigation())

    const targetId = chapters[5].id

    act(() => {
      result.current.goToChapter(targetId)
    })

    expect(result.current.activeChapter).toBe(targetId)
    expect(result.current.slideDirection).toBe('down')
  })

  it('动画锁应阻止快速连续切换', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.goNext()
    })

    act(() => {
      const success = result.current.goNext()
      expect(success).toBe(false)
    })

    expect(result.current.activeChapter).toBe(chapters[1].id)
  })

  it('动画完成后应允许再次切换', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.goNext()
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    act(() => {
      const success = result.current.goNext()
      expect(success).toBe(true)
    })

    expect(result.current.activeChapter).toBe(chapters[2].id)
  })

  it('goToChapter 跳转到同一章节应不触发动画', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.goToChapter(chapters[0].id)
    })

    expect(result.current.slideDirection).toBeNull()
  })

  it('goToChapter 跳转到不存在的章节应不修改状态', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.goToChapter('nonexistent-id')
    })

    expect(result.current.activeChapter).toBe(chapters[0].id)
  })

  it('setActiveChapter 应直接设置章节（无动画）', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.setActiveChapter(chapters[3].id)
    })

    expect(result.current.activeChapter).toBe(chapters[3].id)
  })

  it('动画完成后 slideDirection 应重置为 null', () => {
    const { result } = renderHook(() => useChapterNavigation())

    act(() => {
      result.current.goNext()
    })

    expect(result.current.slideDirection).toBe('down')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current.slideDirection).toBeNull()
  })
})
