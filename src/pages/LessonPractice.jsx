import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import PhoneSimulator from '../components/PhoneSimulator'
import useProgress from '../hooks/useProgress'
import { lesson } from '../data/lessonData'

const { steps, retry, corrections } = lesson

export default function LessonPractice({ onNavigate }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [mode, setMode] = useState('SHOW_ME')
  const [phoneScreen, setPhoneScreen] = useState(steps[0].startScreen)
  const [retryIndex, setRetryIndex] = useState(0)
  const [correction, setCorrection] = useState(null)
  const [returnMode, setReturnMode] = useState('LET_ME_TRY')
  const { markComplete } = useProgress()

  const isRetry = stepIndex >= steps.length
  const current = isRetry ? retry : steps[stepIndex]
  const totalSteps = steps.length + 1
  const stepNumber = Math.min(stepIndex + 1, totalSteps)
  const done = mode === 'DONE'
  const percent = done ? 100 : ((stepNumber - 1) / totalSteps) * 100

  const highlight = mode === 'SHOW_ME' ? steps[stepIndex]?.expect : null
  const interactive = mode === 'LET_ME_TRY' || mode === 'INDEPENDENT_RETRY'

  function goNext() {
    const next = stepIndex + 1
    setStepIndex(next)
    if (next < steps.length) {
      setPhoneScreen(steps[next].startScreen)
      setMode('SHOW_ME')
    } else {
      setPhoneScreen(retry.startScreen)
      setRetryIndex(0)
      setMode('INDEPENDENT_RETRY')
    }
  }

  function showCorrection(actionId) {
    setCorrection(corrections[actionId] || corrections.default)
    setReturnMode(mode)
    setMode('CORRECT_ME')
  }

  function handleAction(actionId) {
    if (mode === 'LET_ME_TRY') {
      if (actionId === steps[stepIndex].expect) goNext()
      else showCorrection(actionId)
    } else if (mode === 'INDEPENDENT_RETRY') {
      if (actionId === retry.sequence[retryIndex]) {
        if (actionId === 'open-ayesha') setPhoneScreen('chat')
        if (actionId === 'video-btn') {
          setPhoneScreen('video')
          setMode('DONE')
          markComplete(lesson.id)
        } else {
          setRetryIndex((i) => i + 1)
        }
      } else {
        showCorrection(actionId)
      }
    }
  }

  function tryAgain() {
    setCorrection(null)
    if (returnMode === 'INDEPENDENT_RETRY') {
      setPhoneScreen(retry.startScreen)
      setRetryIndex(0)
    }
    setMode(returnMode)
  }

  function practiseAgain() {
    setStepIndex(0)
    setMode('SHOW_ME')
    setPhoneScreen(steps[0].startScreen)
    setRetryIndex(0)
    setCorrection(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => onNavigate('learn')}
        className="flex min-h-12 w-fit items-center gap-2 text-action"
      >
        <ArrowLeft size={20} aria-hidden="true" />
        <BilingualText as="span" en="Back to Learn & Practise" ur="واپس سیکھیں اور مشق کریں" />
      </button>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: instructions */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <BilingualText
            en={lesson.titleEn} ur={lesson.titleUr}
            enClass="text-2xl font-bold text-primary" urClass="text-2xl font-bold text-primary"
          />

          <div>
            <p className="mb-2 font-semibold">
              <span lang="en" dir="ltr">Step {stepNumber} of {totalSteps}</span>
              {' / '}
              <span lang="ur" dir="rtl" className="urdu">مرحلہ {stepNumber} از {totalSteps}</span>
            </p>
            <div
              role="progressbar" aria-valuemin={0} aria-valuemax={100}
              aria-valuenow={Math.round(percent)} aria-label="Lesson progress"
              className="h-3 w-full rounded-full bg-mint-strong"
            >
              <div className="h-3 rounded-full bg-action" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {!done && mode !== 'CORRECT_ME' && (
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
              {mode === 'INDEPENDENT_RETRY' && (
                <p className="mb-3 w-fit rounded-full bg-mint-strong px-3 py-1 text-sm font-semibold text-primary">
                  On your own / خود کریں
                </p>
              )}
              <BilingualText
                en={current.en} ur={current.ur}
                enClass="text-lg text-muted" urClass="text-2xl font-semibold text-primary"
              />
            </div>
          )}

          <div aria-live="polite" className="flex flex-col gap-4">
            {mode === 'SHOW_ME' && (
              <>
                <BilingualText
                  en="Look at the highlighted button on the phone."
                  ur="فون پر نمایاں بٹن کو دیکھیں۔"
                />
                <button
                  onClick={() => setMode('LET_ME_TRY')}
                  className="min-h-12 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary"
                >
                  <BilingualText as="span" center en="Try it" ur="آزمائیں" />
                </button>
              </>
            )}

            {mode === 'LET_ME_TRY' && (
              <BilingualText en="Now tap it yourself on the phone." ur="اب فون پر خود ٹیپ کریں۔" />
            )}

            {mode === 'CORRECT_ME' && correction && (
              <div className="flex flex-col gap-4 rounded-2xl bg-warning p-5">
                <BilingualText
                  en={correction.en} ur={correction.ur}
                  enClass="text-lg" urClass="text-xl"
                />
                <button
                  onClick={tryAgain}
                  className="min-h-12 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary"
                >
                  <BilingualText as="span" center en="Try Again" ur="دوبارہ کوشش کریں" />
                </button>
              </div>
            )}

            {done && (
              <div className="flex flex-col gap-4 rounded-2xl bg-mint-strong p-6">
                <BilingualText
                  en="You did it!" ur="آپ نے کر لیا!"
                  enClass="text-3xl font-bold text-primary" urClass="text-3xl font-bold text-primary"
                />
                <BilingualText
                  en="You completed your first practice."
                  ur="آپ نے اپنی پہلی مشق مکمل کر لی۔"
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => onNavigate('progress')}
                    className="min-h-12 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary"
                  >
                    <BilingualText as="span" center en="Finish" ur="مکمل کریں" />
                  </button>
                  <button
                    onClick={practiseAgain}
                    className="min-h-12 rounded-xl border border-action px-5 py-3 font-semibold text-action hover:bg-mint"
                  >
                    <BilingualText as="span" center en="Practise Again" ur="دوبارہ مشق کریں" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: phone */}
        <div className="lg:col-span-3">
          <PhoneSimulator
            screen={phoneScreen}
            highlight={highlight}
            interactive={interactive}
            onAction={handleAction}
          />
        </div>
      </div>
    </div>
  )
}