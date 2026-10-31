import BilingualText from '../components/BilingualText'
import useProgress from '../hooks/useProgress'
import { LESSON_ID } from '../data/lessonData'

export default function MyProgress({ onNavigate }) {
  const { progress, completedCount, totalLessons } = useProgress()
  const whatsappDone = progress[LESSON_ID]?.status === 'completed'
  const percent = Math.min(100, Math.round((completedCount / totalLessons) * 100))

  // Find all other completed lessons
  const otherCompleted = Object.entries(progress)
    .filter(([id, item]) => id !== LESSON_ID && item?.status === 'completed')
    .map(([id, item]) => ({ id, ...item }))

  return (
    <div className="flex flex-col gap-6">
      <BilingualText
        en="My Progress"
        ur="میری کارکردگی"
        enClass="text-3xl font-bold text-primary"
        urClass="text-3xl font-bold text-primary"
      />

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <p className="mb-2 font-semibold">
          {completedCount} of {totalLessons} completed /{' '}
          <span lang="ur" dir="rtl" className="urdu">
            {totalLessons} میں سے {completedCount} مکمل
          </span>
        </p>
        <div className="h-3 w-full rounded-full bg-mint-strong">
          <div className="h-3 rounded-full bg-action transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {completedCount === 0 && (
        <BilingualText
          en="Your learning journey starts here. Practise a lesson to see your progress."
          ur="آپ کا سیکھنے کا سفر یہاں سے شروع ہوتا ہے۔ کارکردگی دیکھنے کے لیے کسی سبق کی مشق کریں۔"
        />
      )}

      <div className="flex flex-col gap-4">
        {/* Core WhatsApp Lesson */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6 md:flex-row md:items-center md:justify-between shadow-xs">
          <div>
            <BilingualText
              en="How to make a WhatsApp video call"
              ur="واٹس ایپ پر ویڈیو کال کیسے کریں"
              enClass="font-semibold text-primary text-lg"
              urClass="font-semibold text-primary text-lg"
            />
            <p className="mt-1 text-sm text-muted">
              {whatsappDone ? 'Completed ✓ / مکمل' : 'Available for practice / مشق کے لیے دستیاب'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('lesson')}
            className="min-h-12 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary active:scale-[0.98]"
          >
            {whatsappDone ? (
              <BilingualText as="span" center en="Practise Again" ur="دوبارہ مشق کریں" />
            ) : (
              <BilingualText as="span" center en="Start Lesson" ur="سبق شروع کریں" />
            )}
          </button>
        </div>

        {/* Dynamic AI / Custom Completed Lessons */}
        {otherCompleted.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-mint-strong px-3 py-1 text-xs font-semibold text-primary">
                AI Custom Lesson / اپنی پسند کا سبق
              </span>
              <span className="text-xs text-muted">
                {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : ''}
              </span>
            </div>
            <BilingualText
              en={item.titleEn || 'Interactive Lesson'}
              ur={item.titleUr || 'مشقی سبق'}
              enClass="font-semibold text-primary text-lg"
              urClass="font-semibold text-primary text-lg"
            />
            <p className="text-sm font-medium text-emerald-700">Completed ✓ / مکمل</p>
          </div>
        ))}
      </div>
    </div>
  )
}
