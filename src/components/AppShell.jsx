import { House, BookOpen, ShieldCheck, TrendingUp } from 'lucide-react'
import BilingualText from './BilingualText'

const NAV = [
  { id: 'home', icon: House, en: 'Home', ur: 'گھر' },
  { id: 'learn', icon: BookOpen, en: 'Learn & Practise', ur: 'سیکھیں اور مشق کریں' },
  { id: 'scam', icon: ShieldCheck, en: 'Scam Detective', ur: 'فراڈ کی پہچان' },
  { id: 'progress', icon: TrendingUp, en: 'My Progress', ur: 'میری کارکردگی' },
]

export default function AppShell({ page, onNavigate, children }) {
  const active = page === 'lesson' ? 'learn' : page
  const isHome = page === 'home'

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-1 border-r border-line bg-surface p-3.5 md:flex">
        <button
          onClick={() => onNavigate('home')}
          className="mb-3 flex items-center gap-2 text-left text-xl font-bold text-primary"
        >
          <img src="/logo.svg" alt="Sahaara logo" className="h-8 w-8 shrink-0 rounded-lg" width="32" height="32" />
          <span>Sahaara <span lang="ur" dir="rtl" className="urdu text-lg">سہارا</span></span>
        </button>
        {NAV.map(({ id, icon: Icon, en, ur }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-current={active === id ? 'page' : undefined}
            className={`flex min-h-10 items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left transition-colors ${
              active === id ? 'bg-mint-strong text-primary' : 'hover:bg-mint text-ink'
            }`}
          >
            <Icon size={19} className="shrink-0" aria-hidden="true" />
            <BilingualText as="span" en={en} ur={ur} enClass="font-semibold text-sm leading-tight" urClass="text-xs leading-tight" />
          </button>
        ))}
      </aside>

      <div className="min-w-0 flex-1">
        {/* Welcome header ONLY on Home page */}
        {isHome && (
          <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5 md:px-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-lg font-bold text-primary md:hidden"
            >
              <img src="/logo.svg" alt="Sahaara logo" className="h-8 w-8 shrink-0 rounded-lg" width="32" height="32" />
              <span>Sahaara</span>
            </button>
            <BilingualText
              as="span"
              en="Welcome to Sahaara"
              ur="سہارا میں خوش آمدید"
              enClass="text-sm text-muted font-medium"
              urClass="text-sm text-muted font-medium"
            />
          </header>
        )}

        <main className="mx-auto w-full max-w-[1100px] p-3 pb-20 md:p-5 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-line bg-surface md:hidden z-30">
        {NAV.map(({ id, icon: Icon, en, ur }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-current={active === id ? 'page' : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-0.5 px-1 py-1 ${
              active === id ? 'bg-mint-strong text-primary font-bold' : 'text-ink'
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            <span lang="en" dir="ltr" className="text-[11px] font-semibold leading-none">
              {en.split(' ')[0]}
            </span>
            <span lang="ur" dir="rtl" className="urdu text-[10px] leading-none">
              {ur.split(' ')[0]}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}
