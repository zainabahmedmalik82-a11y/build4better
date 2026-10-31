import { useState, useCallback } from 'react'

const PROGRESS_KEY = 'sahaara_progress_v1'

function read() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}
  } catch {
    return {}
  }
}

export default function useProgress() {
  const [progress, setProgress] = useState(read)

  const markComplete = useCallback((lessonId) => {
    const next = {
      ...read(),
      [lessonId]: { status: 'completed', completedAt: new Date().toISOString() },
    }
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next))
    } catch {
      // storage unavailable, ignore
    }
    setProgress(next)
  }, [])

  const completedCount = Object.values(progress).filter(
    (p) => p.status === 'completed'
  ).length

  return { progress, markComplete, completedCount, totalLessons: 1 }
}