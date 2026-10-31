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
    <div className="flex flex-col gap-4">
      <BilingualText
        en="My Progress"
        ur="میری کارکردگی"
        enClass="text-2xl md:text-3xl font-bold text-primary"
        urClass="text-2xl md:text-3xl font-bold text-primary"
      />

      <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
        <p className="mb-1.5 font-bold text-sm">
          {completedCount} of {totalLessons} completed /{' '}
          <span lang="ur" dir="rtl" className="urdu text-sm">
            {totalLessons} میں سے {completedCount} مکمل
          </span>
        </p>
        <div className="h-2.5 w-full rounded-full bg-mint-strong">
          <div className="h-2.5 rounded-full bg-action transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {completedCount === 0 && (
        <BilingualText
          en="Your learning journey starts here. Practise a lesson to see your progress."
          ur="آپ کا سیکھنے کا سفر یہاں سے شروع ہوتا ہے۔ کارکردگی دیکھنے کے لیے کسی سبق کی مشق کریں۔"
          enClass="text-sm text-muted font-medium"
          urClass="text-sm text-muted font-medium"
        />
      )}

      <div className="flex flex-col gap-3">
        {/* Core WhatsApp Lesson */}
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 md:flex-row md:items-center md:justify-between shadow-xs">
          <div>
            <BilingualText
              en="How to make a WhatsApp video call"
              ur="واٹس ایپ پر ویڈیو کال کیسے کریں"
              enClass="font-bold text-primary text-base md:text-lg"
              urClass="font-bold text-primary text-base md:text-lg"
            />
            <p className="mt-0.5 text-xs text-muted font-medium">
              {whatsappDone ? 'Completed ✓ / مکمل' : 'Available for practice / مشق کے لیے دستیاب'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('lesson')}
            className="min-h-10 rounded-xl bg-action px-4 py-2 text-sm font-bold text-white hover:bg-primary active:scale-[0.98] transition-colors"
          >
            <BilingualText as="span" center en={whatsappDone ? 'Practise Again' : 'Start'} ur={whatsappDone ? 'دوبارہ مشق کریں' : 'شروع کریں'} />
          </button>
        </div>

        {/* Dynamic AI Completed Lessons */}
        {otherCompleted.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 md:flex-row md:items-center md:justify-between shadow-xs animate-fadeIn"
          >
            <div>
              <BilingualText
                en={item.titleEn || 'Custom AI Lesson'}
                ur={item.titleUr || 'اے آئی مشقی سبق'}
                enClass="font-bold text-primary text-base"
                urClass="font-bold text-primary text-base"
              />
              <p className="mt-0.5 text-xs text-muted font-medium">
                Completed on {new Date(item.completedAt).toLocaleDateString()} ✓ / مکمل
              </p>
            </div>
            <span className="text-xs font-bold text-action bg-mint px-2.5 py-1 rounded-lg w-fit">
              Mastered / سیکھ لیا
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
