import { useState } from 'react'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import LessonPractice from './pages/LessonPractice'
import ScamDetective from './pages/ScamDetective'
import MyProgress from './pages/MyProgress'

export default function App() {
  const [page, setPage] = useState('home')
  const [currentLesson, setCurrentLesson] = useState(null)

  function handleStartLesson(lessonData) {
    setCurrentLesson(lessonData)
    setPage('lesson')
  }

  return (
    <AppShell page={page} onNavigate={setPage}>
      {page === 'home' && <Dashboard onNavigate={setPage} />}
      {page === 'learn' && <Learn onNavigate={setPage} onStartLesson={handleStartLesson} />}
      {page === 'lesson' && <LessonPractice onNavigate={setPage} lessonData={currentLesson} />}
      {page === 'scam' && <ScamDetective />}
      {page === 'progress' && <MyProgress onNavigate={setPage} />}
    </AppShell>
  )
}
