import { useState } from 'react'
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import { analyzeMessage } from '../services/api'

const RISK_DETAILS = {
  high: {
    badge: 'bg-red-100 text-red-800 border border-red-300',
    label: { en: 'High Risk', ur: 'زیادہ خطرہ' },
  },
  medium: {
    badge: 'bg-amber-100 text-amber-900 border border-amber-300',
    label: { en: 'Medium Risk', ur: 'درمیانہ خطرہ' },
  },
  low: {
    badge: 'bg-teal-100 text-teal-900 border border-teal-300',
    label: { en: 'Low Risk', ur: 'کم خطرہ' },
  },
  unknown: {
    badge: 'bg-slate-100 text-slate-800 border border-slate-300',
    label: { en: 'Unknown Risk', ur: 'غیر واضح خطرہ' },
  },
}

export default function ScamDetective() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function check() {
    const trimmed = text.trim()
    if (!trimmed) {
      setError({
        en: 'Please paste a message first.',
        ur: 'براہ کرم پہلے کوئی پیغام پیسٹ کریں۔',
      })
      setResult(null)
      return
    }

    if (trimmed.length > 5000) {
      setError({
        en: 'The message is too long (over 5,000 characters). Please paste a shorter portion.',
        ur: 'پیغام بہت لمبا ہے (5000 سے زیادہ حروف)۔ براہ کرم اس کا مختصر حصہ پیسٹ کریں۔',
      })
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeMessage(trimmed)
      setResult(data)
    } catch (err) {
      if (err.type === '422') {
        setError({
          en: 'Please provide a valid message to check (at most 5,000 characters).',
          ur: 'براہ کرم چیک کرنے کے لیے درست پیغام درج کریں (زیادہ سے زیادہ 5000 حروف)۔',
        })
      } else if (err.type === 'timeout') {
        setError({
          en: 'Analysis timed out. Please check your internet connection and try again.',
          ur: 'تجزیے کا وقت ختم ہو گیا۔ اپنا انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔',
        })
      } else if (err.type === 'network') {
        setError({
          en: 'Unable to reach the server. Please check your connection or make sure the service is running.',
          ur: 'سرور سے رابطہ نہیں ہو سکا۔ انٹرنیٹ چیک کریں یا تصدیق کریں کہ سروس چل رہی ہے۔',
        })
      } else if (err.type === '500') {
        setError({
          en: 'The server had trouble analyzing this message. Please try again in a moment.',
          ur: 'پیغام کے تجزیے میں عارضی خرابی پیش آئی۔ کچھ دیر بعد دوبارہ کوشش کریں۔',
        })
      } else {
        setError({
          en: 'Something went wrong while analyzing the message. Please try again.',
          ur: 'تجزیے کے دوران کوئی خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setText('')
    setResult(null)
    setError(null)
  }

  const riskInfo = result ? (RISK_DETAILS[result.risk_level] || RISK_DETAILS.unknown) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 text-primary">
        <ShieldCheck size={30} aria-hidden="true" />
        <BilingualText
          en="Scam Detective"
          ur="فراڈ کی پہچان"
          enClass="text-2xl md:text-3xl font-bold"
          urClass="text-2xl md:text-3xl font-bold"
        />
      </div>
      <BilingualText
        en="Paste a suspicious SMS or message below. We'll point out warning signs."
        ur="کوئی مشکوک ایس ایم ایس یا پیغام نیچے پیسٹ کریں۔ ہم خطرے کی نشانیاں بتائیں گے۔"
        enClass="text-sm md:text-base text-muted font-medium"
        urClass="text-sm md:text-base text-muted font-medium"
      />

      <div className="rounded-2xl border-2 border-danger bg-warning p-3.5">
        <div className="mb-1.5 flex items-center gap-2 font-bold text-danger text-sm">
          <AlertTriangle size={18} aria-hidden="true" /> Important / اہم
        </div>
        <BilingualText
          en="Never enter an OTP, PIN, password, card number, or banking login details."
          ur="اپنا او ٹی پی، پن، پاس ورڈ، کارڈ نمبر یا بینک لاگ اِن کی معلومات یہاں درج نہ کریں۔"
          enClass="text-xs md:text-sm font-semibold"
          urClass="text-xs md:text-sm font-semibold"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label htmlFor="msg" className="font-bold text-sm">
          <span lang="en" dir="ltr">Suspicious message</span>{' / '}
          <span lang="ur" dir="rtl" className="urdu text-sm">مشکوک پیغام</span>
        </label>
        <textarea
          id="msg"
          rows={4}
          maxLength={5000}
          value={text}
          disabled={loading}
          onChange={(e) => {
            setText(e.target.value)
            setError(null)
          }}
          placeholder="Example: Your parcel is waiting. Click this link to confirm."
          className="w-full rounded-xl border border-line bg-surface p-3 text-base disabled:opacity-70"
        />

        {error && (
          <div role="alert" className="rounded-xl border border-danger/40 bg-red-50 p-3 text-danger text-xs md:text-sm">
            <BilingualText
              en={error.en}
              ur={error.ur}
              enClass="font-bold"
              urClass="font-bold"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={check}
            disabled={loading}
            className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-action px-5 py-2 font-bold text-white hover:bg-primary disabled:opacity-60 transition-colors"
          >
            {loading && <Loader2 className="animate-spin" size={18} aria-hidden="true" />}
            {loading ? (
              <BilingualText as="span" center en="Checking..." ur="چیک ہو رہا ہے..." />
            ) : (
              <BilingualText as="span" center en="Check Message" ur="پیغام چیک کریں" />
            )}
          </button>

          {(text || result || error) && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="flex min-h-10 items-center justify-center rounded-xl border border-line bg-surface px-4 py-2 font-bold text-muted hover:bg-mint transition-colors text-sm"
            >
              <BilingualText as="span" center en="Clear" ur="صاف کریں" />
            </button>
          )}
        </div>
      </div>

      {result && (
        <section
          aria-live="polite"
          className="flex flex-col gap-3.5 rounded-2xl border border-line bg-surface p-4.5 shadow-sm"
        >
          {/* Risk Level Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <p className={`w-fit rounded-full px-3 py-1 text-base font-bold ${riskInfo.badge}`}>
              <span lang="en" dir="ltr">{riskInfo.label.en}</span>{' / '}
              <span lang="ur" dir="rtl" className="urdu">{riskInfo.label.ur}</span>
            </p>
          </div>

          {/* Visible note if analysis_source is fallback */}
          {result.analysis_source === 'fallback' && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs">
              <BilingualText
                en="AI analysis unavailable, basic checks only"
                ur="اے آئی تجزیہ دستیاب نہیں، صرف بنیادی چیکس کیے گئے ہیں"
                enClass="font-bold"
                urClass="font-bold"
              />
            </div>
          )}

          {/* "low" must NEVER look like "safe": prominent warning note */}
          {result.risk_level === 'low' && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-teal-950 text-xs">
              <BilingualText
                en="Low risk does not mean guaranteed safe."
                ur="کم خطرے کا مطلب یہ نہیں کہ یہ مکمل طور پر محفوظ ہے۔"
                enClass="font-bold"
                urClass="font-bold"
              />
            </div>
          )}

          {/* Summary en and summary ur */}
          <div className="flex flex-col gap-0.5">
            <p lang="en" dir="ltr" className="text-base font-bold text-ink">
              {result.summary_en}
            </p>
            <p lang="ur" dir="rtl" className="urdu text-lg font-bold text-ink">
              {result.summary_ur}
            </p>
          </div>

          {/* Indicators */}
          {result.indicators && result.indicators.length > 0 && (
            <div>
              <h2 className="mb-1.5 font-bold text-primary text-sm">
                <span lang="en" dir="ltr">Warning signs</span>{' / '}
                <span lang="ur" dir="rtl" className="urdu text-sm">خطرے کی نشانیاں</span>
              </h2>
              <ul className="list-disc space-y-1.5 ps-5 text-sm">
                {result.indicators.map((indicator, idx) => (
                  <li key={idx}>
                    <div className="flex flex-col">
                      <span lang="en" dir="ltr" className="font-semibold text-ink">{indicator.en}</span>
                      <span lang="ur" dir="rtl" className="urdu text-xs font-semibold text-ink">{indicator.ur}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safe Steps */}
          {result.safe_steps && result.safe_steps.length > 0 && (
            <div>
              <h2 className="mb-1.5 font-bold text-primary text-sm">
                <span lang="en" dir="ltr">Safe next steps</span>{' / '}
                <span lang="ur" dir="rtl" className="urdu text-sm">محفوظ اگلے اقدامات</span>
              </h2>
              <ol className="list-decimal space-y-1.5 ps-5 text-sm">
                {result.safe_steps.map((step, idx) => (
                  <li key={idx}>
                    {typeof step === 'string' ? (
                      <span lang="en" dir="ltr" className="font-semibold">{step}</span>
                    ) : (
                      <div className="flex flex-col">
                        <span lang="en" dir="ltr" className="font-semibold text-ink">{step?.en}</span>
                        <span lang="ur" dir="rtl" className="urdu text-xs font-semibold text-ink">{step?.ur}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Disclaimer */}
          <div className="border-t border-line pt-2.5">
            <div className="flex flex-col text-xs text-muted font-medium">
              <span lang="en" dir="ltr">{result.disclaimer_en}</span>
              <span lang="ur" dir="rtl" className="urdu text-xs">{result.disclaimer_ur}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
