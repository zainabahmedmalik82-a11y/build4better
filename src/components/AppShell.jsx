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

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-2 border-r border-line bg-surface p-4 md:flex">
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 text-left text-2xl font-bold text-primary"
        >
          Sahaara <span lang="ur" dir="rtl" className="urdu text-xl">سہارا</span>
        </button>
        {NAV.map(({ id, icon: Icon, en, ur }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-current={active === id ? 'page' : undefined}
            className={`flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 text-left ${
              active === id ? 'bg-mint-strong text-primary' : 'hover:bg-mint'
            }`}
          >
            <Icon size={24} aria-hidden="true" />
            <BilingualText as="span" en={en} ur={ur} enClass="font-semibold text-base" urClass="text-sm" />
          </button>
        ))}
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:px-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-xl font-bold text-primary md:hidden"
          >
            Sahaara
          </button>
          <BilingualText
            as="span"
            en="Welcome to Sahaara"
            ur="سہارا میں خوش آمدید"
            enClass="text-sm text-muted"
            urClass="text-sm text-muted"
          />
        </header>

        <main className="mx-auto w-full max-w-[1100px] p-4 pb-28 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-line bg-surface md:hidden">
        {NAV.map(({ id, icon: Icon, en, ur }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-current={active === id ? 'page' : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 ${
              active === id ? 'bg-mint-strong text-primary' : ''
            }`}
          >
            <Icon size={22} aria-hidden="true" />
            <span lang="en" dir="ltr" className="text-xs font-semibold">
              {en.split(' ')[0]}
            </span>
            <span lang="ur" dir="rtl" className="urdu text-xs">
              {ur.split(' ')[0]}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}