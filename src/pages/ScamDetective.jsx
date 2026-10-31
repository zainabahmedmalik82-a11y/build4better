import { useState } from 'react'
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import { analyzeMessage } from '../services/api'

const RISK_DETAILS = {
  high: {
    badge: 'bg-red-100 text-red-800 border border-red-300',
    label: { en: 'High risk', ur: 'زیادہ خطرہ' },
  },
  medium: {
    badge: 'bg-amber-100 text-amber-800 border border-amber-300',
    label: { en: 'Medium risk', ur: 'درمیانہ خطرہ' },
  },
  low: {
    badge: 'bg-teal-100 text-teal-800 border border-teal-300',
    label: { en: 'Low risk', ur: 'کم خطرہ' },
  },
  unknown: {
    badge: 'bg-slate-100 text-slate-800 border border-slate-300',
    label: { en: 'Not sure', ur: 'یقین نہیں' },
  },
}

const ERROR_MESSAGES = {
  '422': {
    en: 'Please enter a message (up to 5000 characters)',
    ur: 'براہ کرم ایک پیغام درج کریں (زیادہ سے زیادہ 5000 حروف)',
  },
  timeout: {
    en: 'Request timed out. The server took too long to respond. Please try again.',
    ur: 'وقت ختم ہو گیا۔ سرور نے جواب دینے میں زیادہ وقت لیا۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  network: {
    en: 'Cannot connect to the server. Please ensure the backend is running.',
    ur: 'سرور سے رابطہ ممکن نہیں ہو سکا۔ براہ کرم یقینی بنائیں کہ سرور چل رہا ہے۔',
  },
  '500': {
    en: 'Unable to complete security analysis due to a server error. Please try again later.',
    ur: 'سرور کی خرابی کی وجہ سے سیکیورٹی تجزیہ مکمل نہیں ہو سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔',
  },
  unknown: {
    en: 'Unable to complete security analysis. Please try again later.',
    ur: 'سیکیورٹی تجزیہ مکمل نہیں ہو سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔',
  },
}

export default function ScamDetective() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  async function check() {
    if (!text.trim()) {
      setError(ERROR_MESSAGES['422'])
      setResult(null)
      return
    }

    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const data = await analyzeMessage(text.trim())
      setResult(data)
    } catch (err) {
      const errKey = err?.type || 'unknown'
      setError(ERROR_MESSAGES[errKey] || ERROR_MESSAGES.unknown)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setText('')
    setError(null)
    setResult(null)
  }

  const riskInfo = result ? (RISK_DETAILS[result.risk_level] || RISK_DETAILS.unknown) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 text-primary">
        <ShieldCheck size={36} aria-hidden="true" />
        <BilingualText
          en="Scam Detective"
          ur="فراڈ کی پہچان"
          enClass="text-3xl font-bold"
          urClass="text-3xl font-bold"
        />
      </div>
      <BilingualText
        en="Paste a suspicious SMS or message below. We'll point out warning signs."
        ur="کوئی مشکوک ایس ایم ایس یا پیغام نیچے پیسٹ کریں۔ ہم خطرے کی نشانیاں بتائیں گے۔"
      />

      <div className="rounded-2xl border-2 border-danger bg-warning p-5">
        <div className="mb-2 flex items-center gap-2 font-semibold text-danger">
          <AlertTriangle size={22} aria-hidden="true" /> Important / اہم
        </div>
        <BilingualText
          en="Never enter an OTP, PIN, password, card number, or banking login details."
          ur="اپنا او ٹی پی، پن، پاس ورڈ، کارڈ نمبر یا بینک لاگ اِن کی معلومات یہاں درج نہ کریں۔"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="msg" className="font-semibold">
          <span lang="en" dir="ltr">Suspicious message</span>{' / '}
          <span lang="ur" dir="rtl" className="urdu">مشکوک پیغام</span>
        </label>
        <textarea
          id="msg"
          rows={6}
          maxLength={5000}
          value={text}
          disabled={loading}
          onChange={(e) => {
            setText(e.target.value)
            setError(null)
          }}
          placeholder="Example: Your parcel is waiting. Click this link to confirm."
          className="w-full rounded-xl border border-line bg-surface p-4 text-lg disabled:opacity-70"
        />

        {error && (
          <div role="alert" className="rounded-xl border border-danger/40 bg-red-50 p-4 text-danger">
            <BilingualText
              en={error.en}
              ur={error.ur}
              enClass="font-semibold"
              urClass="font-semibold"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={check}
            disabled={loading}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-action px-6 py-3 font-semibold text-white hover:bg-primary disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={20} aria-hidden="true" />}
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
              className="flex min-h-12 items-center justify-center rounded-xl border border-line bg-surface px-5 py-3 font-medium text-muted hover:bg-mint"
            >
              <BilingualText as="span" center en="Clear" ur="صاف کریں" />
            </button>
          )}
        </div>
      </div>

      {result && (
        <section
          aria-live="polite"
          className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 shadow-sm"
        >
          {/* Risk Level Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <p className={`w-fit rounded-full px-4 py-2 text-lg font-bold ${riskInfo.badge}`}>
              <span lang="en" dir="ltr">{riskInfo.label.en}</span>{' / '}
              <span lang="ur" dir="rtl" className="urdu">{riskInfo.label.ur}</span>
            </p>
          </div>

          {/* Visible note if analysis_source is fallback */}
          {result.analysis_source === 'fallback' && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
              <BilingualText
                en="AI analysis unavailable, basic checks only"
                ur="اے آئی تجزیہ دستیاب نہیں، صرف بنیادی چیکس کیے گئے ہیں"
                enClass="font-semibold"
                urClass="font-semibold"
              />
            </div>
          )}

          {/* "low" must NEVER look like "safe": prominent warning note */}
          {result.risk_level === 'low' && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-teal-950">
              <BilingualText
                en="Low risk does not mean guaranteed safe."
                ur="کم خطرے کا مطلب یہ نہیں کہ یہ مکمل طور پر محفوظ ہے۔"
                enClass="font-semibold"
                urClass="font-semibold"
              />
            </div>
          )}

          {/* Summary en and summary ur (lang="ur" dir="rtl" only on that element) */}
          <div className="flex flex-col gap-1">
            <p lang="en" dir="ltr" className="text-lg font-semibold text-ink">
              {result.summary_en}
            </p>
            <p lang="ur" dir="rtl" className="urdu text-xl font-semibold text-ink">
              {result.summary_ur}
            </p>
          </div>

          {/* Indicators */}
          {result.indicators && result.indicators.length > 0 && (
            <div>
              <h2 className="mb-2 font-bold text-primary">
                <span lang="en" dir="ltr">Warning signs</span>{' / '}
                <span lang="ur" dir="rtl" className="urdu">خطرے کی نشانیاں</span>
              </h2>
              <ul className="list-disc space-y-3 ps-6">
                {result.indicators.map((indicator, idx) => (
                  <li key={idx}>
                    <div className="flex flex-col">
                      <span lang="en" dir="ltr">{indicator.en}</span>
                      <span lang="ur" dir="rtl" className="urdu">{indicator.ur}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safe Steps */}
          {result.safe_steps && result.safe_steps.length > 0 && (
            <div>
              <h2 className="mb-2 font-bold text-primary">
                <span lang="en" dir="ltr">Safe next steps</span>{' / '}
                <span lang="ur" dir="rtl" className="urdu">محفوظ اگلے اقدامات</span>
              </h2>
              <ol className="list-decimal space-y-3 ps-6">
                {result.safe_steps.map((step, idx) => (
                  <li key={idx}>
                    {typeof step === 'string' ? (
                      <span lang="en" dir="ltr">{step}</span>
                    ) : (
                      <div className="flex flex-col">
                        <span lang="en" dir="ltr">{step?.en}</span>
                        <span lang="ur" dir="rtl" className="urdu">{step?.ur}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Disclaimer */}
          <div className="border-t border-line pt-4">
            <div className="flex flex-col text-sm text-muted">
              <span lang="en" dir="ltr">{result.disclaimer_en}</span>
              <span lang="ur" dir="rtl" className="urdu">{result.disclaimer_ur}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}