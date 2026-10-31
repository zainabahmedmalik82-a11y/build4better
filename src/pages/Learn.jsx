import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, PlayCircle } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import { generateLesson } from '../services/api'

const EXAMPLE_CHIPS = [
  {
    en: 'I want to send money in a banking app',
    ur: 'مجھے بینک ایپ سے پیسے بھیجنے ہیں',
  },
  {
    en: 'My video call will not connect',
    ur: 'میری ویڈیو کال نہیں مل رہی',
  },
  {
    en: 'I want to fill an online form',
    ur: 'مجھے آن لائن فارم بھرنا ہے',
  },
]

export default function Learn({ onNavigate, onStartLesson }) {
  const [problem, setProblem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const charCount = problem.length
  const isOverLimit = charCount > 500

  async function handleCreateLesson(e) {
    if (e) e.preventDefault()
    const trimmed = problem.trim()

    if (!trimmed) {
      setError({
        en: 'Please describe what you want help with.',
        ur: 'براہ کرم بتائیں کہ آپ کو کس چیز میں مدد چاہیے۔',
      })
      return
    }

    if (trimmed.length > 500) {
      setError({
        en: 'Please keep your description under 500 characters.',
        ur: 'براہ کرم اپنا بیان 500 حروف سے کم رکھیں۔',
      })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const lessonData = await generateLesson(trimmed)
      if (onStartLesson) {
        onStartLesson(lessonData)
      } else {
        onNavigate('lesson')
      }
    } catch (err) {
      if (err.type === '422') {
        setError({
          en: 'Please provide a clear description between 1 and 500 characters.',
          ur: 'براہ کرم 1 سے 500 حروف کے درمیان واضح بیان درج کریں۔',
        })
      } else if (err.type === 'timeout') {
        setError({
          en: 'Lesson creation timed out. Please check your connection and try again.',
          ur: 'سبق کی تیاری میں زیادہ وقت لگا۔ اپنا انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔',
        })
      } else if (err.type === 'network') {
        setError({
          en: 'Cannot reach the backend server. Please verify the service is running.',
          ur: 'سرور سے رابطہ نہیں ہو سکا۔ براہ کرم چیک کریں کہ سروس چل رہی ہے۔',
        })
      } else if (err.type === '500') {
        setError({
          en: 'Server encountered an issue. Please try again in a moment.',
          ur: 'سرور میں عارضی خرابی پیش آئی۔ کچھ دیر بعد دوبارہ کوشش کریں۔',
        })
      } else {
        setError({
          en: 'Unable to create lesson right now. Please try again.',
          ur: 'اس وقت سبق تیار نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  function handleSelectChip(chip) {
    setProblem(chip.en)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div>
        <BilingualText
          en="Learn & Practise"
          ur="سیکھیں اور مشق کریں"
          enClass="text-3xl font-bold text-primary"
          urClass="text-3xl font-bold text-primary"
        />
        <div className="mt-1">
          <BilingualText
            en="Pick a lesson or tell us what you want to learn. Nothing here can go wrong."
            ur="کوئی سبق چنیں یا بتائیں کہ آپ کیا سیکھنا چاہتے ہیں۔ یہاں کچھ بھی خراب نہیں ہو سکتا۔"
            enClass="text-muted text-base"
            urClass="text-muted text-base"
          />
        </div>
      </div>

      {/* AI Practice Generator Box */}
      <div className="rounded-2xl border-2 border-action/30 bg-gradient-to-br from-white via-surface to-mint/20 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-action mb-2">
          <Sparkles size={22} className="shrink-0" />
          <BilingualText
            as="h2"
            en="Tell us what you want help with"
            ur="اپنا مسئلہ بتائیں"
            enClass="text-xl font-bold text-primary"
            urClass="text-xl font-bold text-primary"
          />
        </div>
        <p className="text-sm text-muted mb-4">
          <span lang="en">Type any smartphone problem or choose an example below. Our AI coach will build a safe, interactive practice phone for you.</span>
          <br />
          <span lang="ur" dir="rtl" className="urdu text-sm block mt-1">
            فون کا کوئی بھی مسئلہ لکھیں یا نیچے دی گئی مثالوں میں سے چنیں۔ ہمارا اے آئی کوچ آپ کے لیے ایک محفوظ مشقی فون تیار کرے گا۔
          </span>
        </p>

        {/* Example Chips */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            <span lang="en">Quick Examples / فوری مثالیں:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSelectChip(chip)}
                className="flex flex-col items-start rounded-xl border border-line bg-white px-3.5 py-2 text-left text-xs transition-colors hover:border-action hover:bg-mint/40 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="font-semibold text-primary">{chip.en}</span>
                <span lang="ur" dir="rtl" className="urdu text-[11px] text-action font-medium">
                  {chip.ur}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCreateLesson} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              rows={3}
              maxLength={500}
              value={problem}
              disabled={loading}
              onChange={(e) => {
                setProblem(e.target.value)
                if (error) setError(null)
              }}
              placeholder="e.g., I want to pay my electricity bill on Easypaisa / مثلاً، مجھے ایزی پیسہ پر بجلی کا بل جمع کروانا ہے"
              className="w-full rounded-xl border border-line bg-white p-3.5 text-ink text-sm shadow-inner placeholder:text-muted/60 focus:border-action focus:outline-hidden focus:ring-2 focus:ring-action/20 disabled:bg-slate-50"
            />
            <div className="mt-1 flex justify-between px-1 text-xs text-muted">
              <span>Limit: 500 characters</span>
              <span className={isOverLimit ? 'font-bold text-danger' : ''}>
                {charCount} / 500
              </span>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-red-50 p-3.5 text-danger animate-fadeIn">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold">{error.en}</p>
                <p lang="ur" dir="rtl" className="urdu text-xs font-semibold mt-0.5">
                  {error.ur}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !problem.trim() || isOverLimit}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-action px-6 py-3 font-semibold text-white shadow-xs hover:bg-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <BilingualText as="span" center en="Creating your lesson..." ur="مشق تیار ہو رہی ہے..." />
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <BilingualText as="span" center en="Create my practice" ur="میری مشق بنائیں" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Preset Example Lesson Section */}
      <div className="flex flex-col gap-4">
        <div className="border-b border-line pb-2">
          <BilingualText
            as="h2"
            en="Example lesson"
            ur="مثال"
            enClass="text-xl font-bold text-primary"
            urClass="text-xl font-bold text-primary"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-xs">
          <div className="flex flex-col gap-1">
            <BilingualText
              en="How to make a WhatsApp video call"
              ur="واٹس ایپ پر ویڈیو کال کیسے کریں"
              enClass="text-xl font-semibold text-primary"
              urClass="text-xl font-semibold text-primary"
            />
            <BilingualText
              en="Level: Beginner • 2–3 minutes"
              ur="سطح: ابتدائی • 2 سے 3 منٹ"
              enClass="text-sm text-muted"
              urClass="text-sm text-muted"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (onStartLesson) onStartLesson(null)
              else onNavigate('lesson')
            }}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary active:scale-[0.98] sm:w-fit"
          >
            <PlayCircle size={18} />
            <BilingualText as="span" center en="Start Lesson" ur="سبق شروع کریں" />
          </button>
        </div>

        <div className="rounded-2xl border border-line bg-warning/30 p-4 text-ink">
          <BilingualText
            en="This is a simulated practice phone. It does not connect to a real WhatsApp or banking account."
            ur="یہ ایک نقلی مشقی فون ہے۔ یہ کسی اصلی واٹس ایپ یا بینک اکاؤنٹ سے نہیں جڑتا۔"
            enClass="text-xs text-muted"
            urClass="text-xs text-muted"
          />
        </div>
      </div>
    </div>
  )
}
