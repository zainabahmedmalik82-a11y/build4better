const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const LEVELS = ['low', 'medium', 'high']

const RULES = [
  { re: /\b(otp|pin|password|cvv|card number)\b/i, weight: 3,
    en: 'It asks for an OTP, PIN, password or card details.',
    ur: 'یہ او ٹی پی، پن، پاس ورڈ یا کارڈ کی معلومات مانگ رہا ہے۔' },
  { re: /(blocked|suspend|expire|deactivat|urgent|immediately|within 24|today)/i, weight: 2,
    en: 'It uses urgency or threats to rush you.',
    ur: 'اس میں جلدی اور دھمکی کا انداز ہے۔' },
  { re: /(bank|hbl|ubl|jazzcash|easypaisa|nadra|fbr|government)/i, weight: 2,
    en: 'It claims to be from a bank or government service.',
    ur: 'یہ خود کو بینک یا سرکاری ادارے کا ظاہر کرتا ہے۔' },
  { re: /(https?:\/\/|bit\.ly|tinyurl|www\.)/i, weight: 1,
    en: 'It contains a link. Do not open it.',
    ur: 'اس میں ایک لنک ہے۔ اسے نہ کھولیں۔' },
]

const SAFE_STEPS = [
  { en: 'Do not share your OTP, PIN or password with anyone.', ur: 'اپنا او ٹی پی، پن یا پاس ورڈ کسی کو نہ دیں۔' },
  { en: 'Do not open links in the message.', ur: 'پیغام میں دیے گئے لنک نہ کھولیں۔' },
  { en: 'Contact your bank using the number on your card or its official website.', ur: 'اپنے بینک سے کارڈ پر دیے گئے نمبر یا سرکاری ویب سائٹ کے ذریعے رابطہ کریں۔' },
  { en: 'Show the message to someone you trust.', ur: 'کسی بھروسے مند شخص کو یہ پیغام دکھائیں۔' },
]

const SUMMARY = {
  high: { en: 'This message has several warning signs.', ur: 'اس پیغام میں خطرے کی کئی نشانیاں موجود ہیں۔' },
  medium: { en: 'This message has some warning signs. Be careful.', ur: 'اس پیغام میں خطرے کی کچھ نشانیاں ہیں۔ احتیاط کریں۔' },
  unknown: { en: 'We could not find clear warning signs, but that does not mean it is safe.', ur: 'ہمیں واضح نشانیاں نہیں ملیں، لیکن اس کا مطلب یہ نہیں کہ یہ محفوظ ہے۔' },
}

const DISCLAIMER = {
  en: 'This is guidance, not a guarantee.',
  ur: 'یہ رہنمائی ہے، حتمی ضمانت نہیں۔',
}

function localAnalyze(message) {
  const hits = RULES.filter((r) => r.re.test(message))
  const score = hits.reduce((s, r) => s + r.weight, 0)
  const level = score >= 3 ? 'high' : score >= 1 ? 'medium' : 'unknown'
  return {
    risk_level: level,
    summary_en: SUMMARY[level].en,
    summary_ur: SUMMARY[level].ur,
    indicators: hits.map(({ en, ur }) => ({ en, ur })),
    safe_steps: SAFE_STEPS,
    disclaimer_en: DISCLAIMER.en,
    disclaimer_ur: DISCLAIMER.ur,
  }
}

const list = (v) =>
  Array.isArray(v)
    ? v.filter((x) => x && (x.en || x.ur)).map((x) => ({ en: String(x.en || ''), ur: String(x.ur || '') }))
    : []

function normalize(d) {
  const level = LEVELS.includes(d?.risk_level) ? d.risk_level : 'unknown'
  return {
    risk_level: level,
    summary_en: String(d?.summary_en || SUMMARY[level === 'unknown' ? 'unknown' : level]?.en || ''),
    summary_ur: String(d?.summary_ur || SUMMARY[level === 'unknown' ? 'unknown' : level]?.ur || ''),
    indicators: list(d?.indicators),
    safe_steps: list(d?.safe_steps).length ? list(d?.safe_steps) : SAFE_STEPS,
    disclaimer_en: String(d?.disclaimer_en || DISCLAIMER.en),
    disclaimer_ur: String(d?.disclaimer_ur || DISCLAIMER.ur),
  }
}

export async function analyzeMessage(message) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(`${BASE}/api/scam/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error('bad status')
    return { ...normalize(await res.json()), offline: false }
  } catch {
    return { ...localAnalyze(message), offline: true }
  } finally {
    clearTimeout(timer)
  }
}