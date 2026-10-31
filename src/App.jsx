import LessonPractice from './pages/LessonPractice'
import { useState } from 'react'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'

function Placeholder({ title }) {
  return <h1 className="text-2xl font-bold text-primary">{title} (coming next)</h1>
}

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <AppShell page={page} onNavigate={setPage}>
      {page === 'home' && <Dashboard onNavigate={setPage} />}
      {page === 'learn' && <Learn onNavigate={setPage} />}
      {page === 'lesson' && <LessonPractice onNavigate={setPage} />}
      {page === 'scam' && <Placeholder title="Scam Detective" />}
      {page === 'progress' && <Placeholder title="My Progress" />}
    </AppShell>
  )
}