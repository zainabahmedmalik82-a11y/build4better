import { useState } from 'react'
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import { analyzeMessage } from '../services/api'

const LABELS = {
  low: { en: 'Low risk', ur: 'کم خطرہ' },
  medium: { en: 'Medium risk', ur: 'درمیانہ خطرہ' },
  high: { en: 'High risk', ur: 'زیادہ خطرہ' },
  unknown: { en: 'Not sure', ur: 'یقین نہیں' },
}

export default function ScamDetective() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState(null)

  async function check() {
    if (!text.trim()) { setError(true); return }
    setError(false)
    setLoading(true)
    setResult(null)
    const r = await analyzeMessage(text.trim())
    setResult(r)
    setLoading(false)
  }

  const label = result ? LABELS[result.risk_level] : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 text-primary">
        <ShieldCheck size={36} aria-hidden="true" />
        <BilingualText en="Scam Detective" ur="فراڈ کی پہچان"
          enClass="text-3xl font-bold" urClass="text-3xl font-bold" />
      </div>
      <BilingualText
        en="Paste a suspicious SMS or message below. We'll point out warning signs."
        ur="کوئی مشکوک ایس ایم ایس یا پیغام نیچے پیسٹ کریں۔ ہم خطرے کی نشانیاں بتائیں گے۔" />

      <div className="rounded-2xl border-2 border-danger bg-warning p-5">
        <div className="mb-2 flex items-center gap-2 font-semibold text-danger">
          <AlertTriangle size={22} aria-hidden="true" /> Important / اہم
        </div>
        <BilingualText
          en="Never enter an OTP, PIN, password, card number, or banking login details."
          ur="اپنا او ٹی پی، پن، پاس ورڈ، کارڈ نمبر یا بینک لاگ اِن کی معلومات یہاں درج نہ کریں۔" />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="msg" className="font-semibold">
          <span lang="en" dir="ltr">Suspicious message</span>{' / '}
          <span lang="ur" dir="rtl" className="urdu">مشکوک پیغام</span>
        </label>
        <textarea
          id="msg" rows={6} maxLength={1000} value={text}
          onChange={(e) => { setText(e.target.value); setError(false) }}
          placeholder="Example: Your parcel is waiting. Click this link to confirm."
          className="w-full rounded-xl border border-line bg-surface p-4 text-lg"
        />
        {error && (
          <p role="alert" className="font-semibold text-danger">
            <span lang="en" dir="ltr">Please paste a message first.</span>{' / '}
            <span lang="ur" dir="rtl" className="urdu">پہلے کوئی پیغام پیسٹ کریں۔</span>
          </p>
        )}
        <button
          onClick={check} disabled={loading}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary disabled:opacity-60 md:w-fit"
        >
          {loading && <Loader2 className="animate-spin" size={20} aria-hidden="true" />}
          {loading
            ? <BilingualText as="span" center en="Checking..." ur="چیک ہو رہا ہے..." />
            : <BilingualText as="span" center en="Check Message" ur="پیغام چیک کریں" />}
        </button>
      </div>

      {result && (
        <section aria-live="polite" className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <p className="w-fit rounded-full bg-mint-strong px-4 py-2 text-lg font-bold text-primary">
            {label.en} / <span lang="ur" dir="rtl" className="urdu">{label.ur}</span>
          </p>
          <BilingualText en={result.summary_en} ur={result.summary_ur}
            enClass="text-lg font-semibold" urClass="text-xl" />

          {result.indicators.length > 0 && (
            <div>
              <h2 className="mb-2 font-bold text-primary">Warning signs / خطرے کی نشانیاں</h2>
              <ul className="list-disc space-y-3 ps-6">
                {result.indicators.map((i, n) => (
                  <li key={n}><BilingualText en={i.en} ur={i.ur} /></li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="mb-2 font-bold text-primary">Safe next steps / محفوظ اگلے اقدامات</h2>
            <ol className="list-decimal space-y-3 ps-6">
              {result.safe_steps.map((s, n) => (
                <li key={n}><BilingualText en={s.en} ur={s.ur} /></li>
              ))}
            </ol>
          </div>

          {result.offline && (
            <p className="text-sm text-muted">
              <span lang="en" dir="ltr">The online checker is not reachable, so a basic check on your device was used.</span>{' '}
              <span lang="ur" dir="rtl" className="urdu">آن لائن چیکر دستیاب نہیں، اس لیے آپ کے ڈیوائس پر بنیادی چیک استعمال ہوا۔</span>
            </p>
          )}
          <BilingualText en={result.disclaimer_en} ur={result.disclaimer_ur}
            enClass="text-sm text-muted" urClass="text-sm text-muted" />
        </section>
      )}
    </div>
  )
}