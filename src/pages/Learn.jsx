import BilingualText from '../components/BilingualText'

export default function Learn({ onNavigate }) {
  return (
    <div className="flex flex-col gap-6">
      <BilingualText
        en="Learn & Practise" ur="سیکھیں اور مشق کریں"
        enClass="text-3xl font-bold text-primary" urClass="text-3xl font-bold text-primary"
      />
      <BilingualText
        en="Pick a lesson and practise step by step. Nothing here can go wrong."
        ur="ایک سبق چنیں اور قدم بہ قدم مشق کریں۔ یہاں کچھ بھی خراب نہیں ہو سکتا۔"
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <BilingualText
          en="How to make a WhatsApp video call"
          ur="واٹس ایپ پر ویڈیو کال کیسے کریں"
          enClass="text-xl font-semibold text-primary" urClass="text-xl font-semibold text-primary"
        />
        <BilingualText en="Level: Beginner • 2–3 minutes" ur="سطح: ابتدائی • 2 سے 3 منٹ" enClass="text-muted" urClass="text-muted" />
        <button
          onClick={() => onNavigate('lesson')}
          className="min-h-12 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary md:w-fit"
        >
          <BilingualText as="span" center en="Start Lesson" ur="سبق شروع کریں" />
        </button>
      </div>

      <div className="rounded-2xl bg-warning p-5">
        <BilingualText
          en="This is a simulated practice phone. It does not connect to a real WhatsApp account."
          ur="یہ ایک نقلی مشقی فون ہے۔ یہ کسی اصلی واٹس ایپ اکاؤنٹ سے نہیں جڑتا۔"
        />
      </div>
    </div>
  )
}