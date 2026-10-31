import BilingualText from '../components/BilingualText'
import useProgress from '../hooks/useProgress'
import { LESSON_ID } from '../data/lessonData'

export default function MyProgress({ onNavigate }) {
  const { progress, completedCount, totalLessons } = useProgress()
  const done = progress[LESSON_ID]?.status === 'completed'
  const percent = (completedCount / totalLessons) * 100

  return (
    <div className="flex flex-col gap-6">
      <BilingualText en="My Progress" ur="میری کارکردگی"
        enClass="text-3xl font-bold text-primary" urClass="text-3xl font-bold text-primary" />

      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="mb-2 font-semibold">
          {completedCount} of {totalLessons} completed /{' '}
          <span lang="ur" dir="rtl" className="urdu">{totalLessons} میں سے {completedCount} مکمل</span>
        </p>
        <div className="h-3 w-full rounded-full bg-mint-strong">
          <div className="h-3 rounded-full bg-action" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {completedCount === 0 && (
        <BilingualText en="Your learning journey starts here."
          ur="آپ کا سیکھنے کا سفر یہاں سے شروع ہوتا ہے۔" />
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <BilingualText en="WhatsApp video call" ur="واٹس ایپ ویڈیو کال"
            enClass="font-semibold text-primary" urClass="font-semibold text-primary" />
          <p className="mt-1 text-muted">
            {done ? 'Completed ✓ / مکمل' : 'Not started / شروع نہیں ہوا'}
          </p>
        </div>
        <button onClick={() => onNavigate('lesson')}
          className="min-h-12 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary">
          {done
            ? <BilingualText as="span" center en="Practise Again" ur="دوبارہ مشق کریں" />
            : <BilingualText as="span" center en="Start Lesson" ur="سبق شروع کریں" />}
        </button>
      </div>
    </div>
  )
}