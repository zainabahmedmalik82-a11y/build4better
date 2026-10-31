import { BookOpen, ShieldCheck } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import FeatureCard from '../components/FeatureCard'
import useProgress from '../hooks/useProgress'

export default function Dashboard({ onNavigate }) {
  const { completedCount, totalLessons } = useProgress()

  return (
    <div className="flex flex-col gap-3 md:gap-3.5">
      <section className="rounded-2xl bg-mint p-4 md:p-5">
        <BilingualText
          en="Technology, made easier"
          ur="ٹیکنالوجی اب آسان"
          enClass="text-2xl font-bold text-primary md:text-3xl"
          urClass="text-2xl font-bold text-primary md:text-3xl"
        />
        <div className="mt-1.5">
          <BilingualText
            en="Learn and practise safely, at your own pace."
            ur="اپنی رفتار سے محفوظ طریقے سے سیکھیں اور مشق کریں۔"
            enClass="text-sm md:text-base font-medium text-ink"
            urClass="text-sm md:text-base font-medium text-ink"
          />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
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
        className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3.5 text-left hover:bg-mint transition-colors"
      >
        <BilingualText as="span" en="My Progress" ur="میری کارکردگی" enClass="font-bold text-primary text-base" urClass="font-bold text-primary text-base" />
        <span className="flex flex-col text-right">
          <span lang="en" dir="ltr" className="font-bold text-sm">
            {completedCount} of {totalLessons} completed
          </span>
          <span lang="ur" dir="rtl" className="urdu text-xs">
            {totalLessons} میں سے {completedCount} مکمل
          </span>
        </span>
      </button>
    </div>
  )
}
