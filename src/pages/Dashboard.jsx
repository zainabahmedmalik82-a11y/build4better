import { BookOpen, ShieldCheck } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import FeatureCard from '../components/FeatureCard'
import useProgress from '../hooks/useProgress'

export default function Dashboard({ onNavigate }) {
  const { completedCount, totalLessons } = useProgress()

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-mint p-6 md:p-10">
        <BilingualText
          en="Technology, made easier"
          ur="ٹیکنالوجی اب آسان"
          enClass="text-3xl font-bold text-primary md:text-4xl"
          urClass="text-3xl font-bold text-primary md:text-4xl"
        />
        <div className="mt-4">
          <BilingualText
            en="Learn and practise safely, at your own pace."
            ur="اپنی رفتار سے محفوظ طریقے سے سیکھیں اور مشق کریں۔"
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <FeatureCard
          icon={BookOpen}
          titleEn="Learn & Practise" titleUr="سیکھیں اور مشق کریں"
          descEn="Practise a real task on a safe, pretend phone."
          descUr="ایک نقلی فون پر محفوظ طریقے سے مشق کریں۔"
          ctaEn="Start Learning" ctaUr="سیکھنا شروع کریں"
          onClick={() => onNavigate('learn')}
        />
        <FeatureCard
          icon={ShieldCheck}
          titleEn="Scam Detective" titleUr="فراڈ کی پہچان"
          descEn="Paste a suspicious message and see the warning signs."
          descUr="مشکوک پیغام پیسٹ کریں اور خطرے کی نشانیاں دیکھیں۔"
          ctaEn="Check a Message" ctaUr="پیغام چیک کریں"
          onClick={() => onNavigate('scam')}
        />
      </section>

      <button
        onClick={() => onNavigate('progress')}
        className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 text-left hover:bg-mint"
      >
        <BilingualText as="span" en="My Progress" ur="میری کارکردگی" enClass="font-semibold text-primary" urClass="font-semibold text-primary" />
        <span className="flex flex-col text-right">
          <span lang="en" dir="ltr" className="font-semibold">
            {completedCount} of {totalLessons} completed
          </span>
          <span lang="ur" dir="rtl" className="urdu">
            {totalLessons} میں سے {completedCount} مکمل
          </span>
        </span>
      </button>

      <div className="rounded-2xl bg-warning p-5">
        <BilingualText
          en="You can practise here without affecting your real phone."
          ur="آپ یہاں مشق کر سکتے ہیں، آپ کے اصلی فون پر کوئی اثر نہیں پڑے گا۔"
        />
      </div>
    </div>
  )
}