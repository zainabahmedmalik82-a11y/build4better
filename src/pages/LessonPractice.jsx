import { useState } from 'react'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import PhoneSimulator from '../components/PhoneSimulator'
import VoiceControls from '../components/VoiceControls'
import useProgress from '../hooks/useProgress'

const DEFAULT_PRESET_LESSON = {
  title_en: 'How to make a WhatsApp video call',
  title_ur: 'واٹس ایپ پر ویڈیو کال کیسے کریں',
  steps: [
    {
      screen: 'home',
      app_name: 'WhatsApp',
      instruction_en: "Tap on Ayesha's name to open her chat.",
      instruction_ur: 'عائشہ کی چیٹ کھولنے کے لیے ان کے نام پر ٹیپ کریں۔',
      buttons: [
        { id: 'open-ayesha', label_en: 'Ayesha (Chat)', label_ur: 'عائشہ (چیٹ)' },
        { id: 'open-bilal', label_en: 'Bilal (Chat)', label_ur: 'بلال (چیٹ)' },
        { id: 'open-status', label_en: 'Status Tab', label_ur: 'اسٹیٹس ٹیب' },
      ],
      correct_button_id: 'open-ayesha',
      hints: {
        'open-bilal': {
          en: "That is Bilal's chat. Tap on Ayesha's chat instead.",
          ur: 'یہ بلال کی چیٹ ہے۔ آئیں عائشہ کی چیٹ کھولیں۔',
        },
        'open-status': {
          en: "That opens Status updates. Tap on Ayesha's name in Chats.",
          ur: 'یہ اسٹیٹس دکھاتا ہے۔ چیٹس میں عائشہ کے نام پر ٹیپ کریں۔',
        },
      },
      success_en: "Great! You opened Ayesha's chat.",
      success_ur: 'بہت اچھے! آپ نے عائشہ کی چیٹ کھول لی۔',
    },
    {
      screen: 'chat',
      app_name: 'WhatsApp',
      instruction_en: 'Tap the video camera at the top to start a video call.',
      instruction_ur: 'ویڈیو کال شروع کرنے کے لیے اوپر ویڈیو کیمرے پر ٹیپ کریں۔',
      buttons: [
        { id: 'video-btn', label_en: 'Video Camera', label_ur: 'ویڈیو کیمرہ' },
        { id: 'audio-btn', label_en: 'Phone Icon (Audio)', label_ur: 'فون کا نشان (آڈیو)' },
        { id: 'attach-btn', label_en: 'Paperclip (Attach)', label_ur: 'فائل کا نشان' },
      ],
      correct_button_id: 'video-btn',
      hints: {
        'audio-btn': {
          en: 'That starts an audio call. To see the other person, choose the video camera.',
          ur: 'اس سے آڈیو کال شروع ہوتی ہے۔ سامنے والے کو دیکھنے کے لیے ویڈیو کیمرہ منتخب کریں۔',
        },
        'attach-btn': {
          en: 'That is for attaching photos or documents. Tap the video camera icon at the top.',
          ur: 'اس سے تصاویر یا فائلیں بھیجی جاتی ہیں۔ اوپر ویڈیو کیمرے پر ٹیپ کریں۔',
        },
      },
      success_en: 'Calling Ayesha with video!',
      success_ur: 'عائشہ کو ویڈیو کال کی جا رہی ہے!',
    },
    {
      screen: 'app',
      app_name: 'WhatsApp',
      instruction_en: 'Tap the red button to end the call.',
      instruction_ur: 'کال ختم کرنے کے لیے سرخ بٹن پر ٹیپ کریں۔',
      buttons: [
        { id: 'end-btn', label_en: 'Red End Button', label_ur: 'سرخ بٹن (کال ختم)' },
        { id: 'mute-btn', label_en: 'Mute Mic', label_ur: 'مائیک بند کریں' },
      ],
      correct_button_id: 'end-btn',
      hints: {
        'mute-btn': {
          en: 'That mutes your microphone. Tap the red button to end the call.',
          ur: 'اس سے آپ کا مائیکروفون بند ہوتا ہے۔ کال ختم کرنے کے لیے سرخ بٹن دبائیں۔',
        },
      },
      success_en: 'Well done! You successfully ended the call.',
      success_ur: 'شاباش! آپ نے ویڈیو کال کامیابی سے ختم کر لی۔',
    },
  ],
  source: 'preset',
  note_en: 'AI lesson generation is temporarily unavailable. Here is a sample practice lesson.',
  note_ur: 'اے آئی سبق جنریٹر عارضی طور پر دستیاب نہیں ہے۔ یہ نمونہ مشقی سبق پیش کیا جا رہا ہے۔',
  disclaimer_en: 'This simulated lesson is for educational practice only. No real actions or calls are made.',
  disclaimer_ur: 'یہ فرضی مشقی سبق صرف تعلیمی اور سیکھنے کے مقاصد کے لیے ہے۔ کوئی حقیقی عمل یا کال نہیں کی جاتی۔',
}

export default function LessonPractice({ onNavigate, lessonData }) {
  const lesson = lessonData || DEFAULT_PRESET_LESSON
  const steps = lesson.steps && lesson.steps.length > 0 ? lesson.steps : DEFAULT_PRESET_LESSON.steps

  const [stepIndex, setStepIndex] = useState(0)
  // Stages: 'SHOW_ME' | 'LET_ME_TRY' | 'CORRECT_ME' | 'DO_IT_MYSELF' | 'DONE'
  const [stage, setStage] = useState('SHOW_ME')
  const [activeHint, setActiveHint] = useState(null)
  const [lastSuccess, setLastSuccess] = useState(null)
  const [isSelfPractice, setIsSelfPractice] = useState(false)
  const { markComplete } = useProgress()

  const currentStep = steps[stepIndex] || steps[0]
  const totalSteps = steps.length
  const stepNumber = stepIndex + 1

  // Highlight rule: only highlighted during SHOW_ME stage
  const highlightId = stage === 'SHOW_ME' ? currentStep.correct_button_id : null
  // Interactive when in LET_ME_TRY or DO_IT_MYSELF
  const isInteractive = stage === 'LET_ME_TRY' || stage === 'DO_IT_MYSELF'

  function handleButtonAction(buttonId) {
    if (!isInteractive) return

    if (buttonId === currentStep.correct_button_id) {
      // Correct button tapped!
      setActiveHint(null)
      setLastSuccess({
        en: currentStep.success_en || 'Well done! That was correct.',
        ur: currentStep.success_ur || 'شاباش! یہ بالکل درست تھا۔',
      })

      const isLastStep = stepIndex >= totalSteps - 1

      if (!isSelfPractice) {
        // In initial guided practice phase
        if (isLastStep) {
          // Finished guided practice, start "Let Me Do It Myself"
          setTimeout(() => {
            setLastSuccess(null)
            setIsSelfPractice(true)
            setStepIndex(0)
            setStage('DO_IT_MYSELF')
          }, 900)
        } else {
          // Advance to next guided step
          setTimeout(() => {
            setLastSuccess(null)
            setStepIndex((idx) => idx + 1)
            setStage('SHOW_ME')
          }, 900)
        }
      } else {
        // In "Let Me Do It Myself" phase
        if (isLastStep) {
          // Completed entire lesson!
          setTimeout(() => {
            setLastSuccess(null)
            setStage('DONE')
            // Save progress with only title and date (no user problem text)
            const lessonKey = `lesson_${lesson.title_en || 'custom'}_${Date.now()}`
            markComplete(lessonKey, {
              titleEn: lesson.title_en,
              titleUr: lesson.title_ur,
            })
          }, 900)
        } else {
          setTimeout(() => {
            setLastSuccess(null)
            setStepIndex((idx) => idx + 1)
            setStage('DO_IT_MYSELF')
          }, 900)
        }
      }
    } else {
      // Incorrect button tapped -> Gentle correction
      const hint = currentStep.hints?.[buttonId]
      const fallbackHint = {
        en: "That wasn't quite it, and that's okay. Let's try again.",
        ur: 'یہ بالکل درست نہیں تھا، اور کوئی بات نہیں۔ آئیں دوبارہ کوشش کریں۔',
      }
      setActiveHint(hint || fallbackHint)
      setStage('CORRECT_ME')
    }
  }

  function retryStep() {
    setActiveHint(null)
    setStage(isSelfPractice ? 'DO_IT_MYSELF' : 'LET_ME_TRY')
  }

  function restartLesson() {
    setStepIndex(0)
    setIsSelfPractice(false)
    setStage('SHOW_ME')
    setActiveHint(null)
    setLastSuccess(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => onNavigate('learn')}
        className="flex min-h-12 w-fit items-center gap-2 font-medium text-action hover:underline"
      >
        <ArrowLeft size={20} aria-hidden="true" />
        <BilingualText as="span" en="Back to Learn & Practise" ur="واپس سیکھیں اور مشق کریں" />
      </button>

      {/* Preset Fallback Notice */}
      {lesson.source === 'preset' && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={20} />
          <div>
            <p className="font-semibold text-sm">
              {lesson.note_en || 'AI lesson unavailable, showing a sample lesson.'}
            </p>
            <p lang="ur" dir="rtl" className="urdu font-semibold text-sm mt-0.5">
              {lesson.note_ur || 'اے آئی سبق دستیاب نہیں، نمونہ سبق دکھایا جا رہا ہے۔'}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left column: Guidance and Confidence Loop Controls */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Lesson Title */}
          <BilingualText
            en={lesson.title_en}
            ur={lesson.title_ur}
            enClass="text-2xl font-bold text-primary"
            urClass="text-2xl font-bold text-primary"
          />

          {/* Progress Indicator */}
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-semibold text-muted">
              <span>
                Step {stepNumber} of {totalSteps}
              </span>
              <span lang="ur" dir="rtl" className="urdu">
                مرحلہ {stepNumber} از {totalSteps}
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((stepNumber / totalSteps) * 100)}
              className="h-2.5 w-full rounded-full bg-mint-strong"
            >
              <div
                className="h-2.5 rounded-full bg-action transition-all duration-300"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Stage Label Badge */}
          {stage !== 'DONE' && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-mint-strong px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {stage === 'SHOW_ME' && 'Stage 1: Show Me / مجھے دکھائیں'}
                {stage === 'LET_ME_TRY' && 'Stage 2: Let Me Try / اب آپ آزمائیں'}
                {stage === 'CORRECT_ME' && 'Stage 3: Correct Me / دوستانہ رہنمائی'}
                {stage === 'DO_IT_MYSELF' && 'Stage 4: Let Me Do It Myself / خود کریں'}
              </span>
            </div>
          )}

          {/* Instruction Card */}
          {stage !== 'DONE' && stage !== 'CORRECT_ME' && (
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
              <BilingualText
                en={currentStep.instruction_en}
                ur={currentStep.instruction_ur}
                enClass="text-lg text-ink font-medium"
                urClass="text-xl text-primary font-semibold mt-1"
              />
              <VoiceControls text={currentStep.instruction_ur} />
            </div>
          )}

          {/* Dynamic Stage Actions */}
          <div aria-live="polite" className="flex flex-col gap-4">
            {stage === 'SHOW_ME' && (
              <div className="flex flex-col gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200">
                <BilingualText
                  en="Look at the glowing highlighted button on the phone screen."
                  ur="فون اسکرین پر چمکتے ہوئے نمایاں بٹن کو دیکھیں۔"
                  enClass="text-sm text-amber-900"
                  urClass="text-sm text-amber-900"
                />
                <button
                  type="button"
                  onClick={() => setStage('LET_ME_TRY')}
                  className="min-h-12 w-full rounded-xl bg-action px-5 py-3 font-semibold text-white shadow-xs hover:bg-primary active:scale-[0.98]"
                >
                  <BilingualText as="span" center en="Let Me Try" ur="اب میں آزماتا ہوں" />
                </button>
              </div>
            )}

            {stage === 'LET_ME_TRY' && (
              <div className="rounded-xl border border-line bg-white p-3 text-center text-sm text-muted shadow-xs">
                <BilingualText
                  center
                  en="Now tap the correct button yourself on the phone."
                  ur="اب فون پر خود صحیح بٹن کو ٹیپ کریں۔"
                />
              </div>
            )}

            {stage === 'DO_IT_MYSELF' && (
              <div className="rounded-xl border border-mint-strong bg-mint/30 p-3 text-center text-sm text-primary shadow-xs">
                <BilingualText
                  center
                  en="Practise independently without any highlights."
                  ur="بغیر کسی اشارے کے خود اعتماد سے مشق کریں۔"
                />
              </div>
            )}

            {/* Success message banner during transitions */}
            {lastSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 animate-fadeIn">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold">{lastSuccess.en}</p>
                  <p lang="ur" dir="rtl" className="urdu text-xs font-semibold mt-0.5">{lastSuccess.ur}</p>
                </div>
              </div>
            )}

            {/* Correct Me stage: Gentle hint */}
            {stage === 'CORRECT_ME' && activeHint && (
              <div className="flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-xs">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 shrink-0 text-amber-700" size={20} />
                  <div>
                    <BilingualText
                      en={activeHint.en}
                      ur={activeHint.ur}
                      enClass="text-base text-amber-900 font-medium"
                      urClass="text-lg text-amber-900 font-semibold"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={retryStep}
                  className="min-h-12 w-full rounded-xl bg-action px-5 py-3 font-semibold text-white shadow-xs hover:bg-primary active:scale-[0.98]"
                >
                  <BilingualText as="span" center en="Try Again" ur="دوبارہ کوشش کریں" />
                </button>
              </div>
            )}

            {/* Completed state */}
            {stage === 'DONE' && (
              <div className="flex flex-col gap-4 rounded-2xl bg-mint-strong p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-action shrink-0" size={28} />
                  <BilingualText
                    en="You did it!"
                    ur="آپ نے کر دکھایا!"
                    enClass="text-2xl font-bold text-primary"
                    urClass="text-2xl font-bold text-primary"
                  />
                </div>
                <BilingualText
                  en="You completed the entire practice lesson including independent trial."
                  ur="آپ نے آزادانہ مشق سمیت پورا مشقی سبق کامیابی سے مکمل کر لیا ہے۔"
                  enClass="text-sm text-ink"
                  urClass="text-base text-ink"
                />
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onNavigate('progress')}
                    className="min-h-12 flex-1 rounded-xl bg-action px-5 py-3 font-semibold text-white shadow-xs hover:bg-primary active:scale-[0.98]"
                  >
                    <BilingualText as="span" center en="View Progress" ur="کارکردگی دیکھیں" />
                  </button>
                  <button
                    type="button"
                    onClick={restartLesson}
                    className="min-h-12 flex-1 rounded-xl border border-action px-5 py-3 font-semibold text-action hover:bg-mint active:scale-[0.98]"
                  >
                    <BilingualText as="span" center en="Practise Again" ur="دوبارہ مشق کریں" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guidance Disclaimer */}
          <div className="mt-auto border-t border-line pt-3 text-xs text-muted">
            <p>{lesson.disclaimer_en}</p>
            <p lang="ur" dir="rtl" className="urdu mt-1">{lesson.disclaimer_ur}</p>
          </div>
        </div>

        {/* Right column: Simulated Phone */}
        <div className="lg:col-span-3">
          <PhoneSimulator
            screen={currentStep.screen}
            appName={currentStep.app_name}
            buttons={currentStep.buttons}
            highlight={highlightId}
            interactive={isInteractive}
            onAction={handleButtonAction}
          />
        </div>
      </div>
    </div>
  )
}
