import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CheckCircle2, AlertCircle, Volume2, VolumeX, RotateCcw, AlertTriangle } from 'lucide-react'
import BilingualText from '../components/BilingualText'
import PhoneSimulator from '../components/PhoneSimulator'
import useProgress from '../hooks/useProgress'
import useSpeech from '../hooks/useSpeech'

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
  const [guidedMode, setGuidedMode] = useState(false)
  const [activeHint, setActiveHint] = useState(null)
  const [lastSuccess, setLastSuccess] = useState(null)
  const [isSelfPractice, setIsSelfPractice] = useState(false)

  const { markComplete } = useProgress()
  const { speak, stop, replay, toggleMute, isMuted, status: speechStatus, available: speechAvailable, checked: speechChecked } = useSpeech()

  const currentStep = steps[stepIndex] || steps[0]
  const totalSteps = steps.length
  const stepNumber = stepIndex + 1

  const advanceTimerRef = useRef(null)

  // Cleanup speech and timers on unmount
  useEffect(() => {
    return () => {
      stop()
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    }
  }, [stop])

  // In guided mode or self-practice, speak step instruction when stepIndex changes (and guidedMode is true)
  useEffect(() => {
    if (!guidedMode) return
    if (stage === 'LET_ME_TRY' || stage === 'DO_IT_MYSELF') {
      const textToSpeak = currentStep?.instruction_ur
      if (textToSpeak) {
        speak(textToSpeak)
      }
    }
  }, [stepIndex, stage, guidedMode, currentStep, speak])

  // Determine button highlight
  // - In SHOW_ME: highlight correct button
  // - In guided mode (LET_ME_TRY): softly highlight correct button
  // - In DO_IT_MYSELF: no highlight (null)
  const highlightId =
    stage === 'SHOW_ME' || (guidedMode && stage === 'LET_ME_TRY' && !isSelfPractice)
      ? currentStep.correct_button_id
      : null

  // Interactive phone:
  // Interactive whenever in guided mode (LET_ME_TRY), or during self practice
  const isInteractive = stage === 'LET_ME_TRY' || stage === 'DO_IT_MYSELF'

  function handleStartGuidedPractice() {
    // User pressed "Let Me Try" for the first time
    setGuidedMode(true)
    setStage('LET_ME_TRY')
    // Trigger first speech from real user interaction
    speak(currentStep.instruction_ur)
  }

  function handleButtonAction(buttonId) {
    if (!isInteractive) return

    if (buttonId === currentStep.correct_button_id) {
      // Correct button tapped!
      setActiveHint(null)
      const successData = {
        en: currentStep.success_en || 'Well done! That was correct.',
        ur: currentStep.success_ur || 'شاباش! یہ بالکل درست تھا۔',
      }
      setLastSuccess(successData)

      // Speak success in Urdu
      speak(successData.ur)

      const isLastStep = stepIndex >= totalSteps - 1

      if (!isSelfPractice) {
        // Guided practice phase
        if (isLastStep) {
          // Finished guided mode -> Transition to Stage 4: "Let Me Do It Myself"
          advanceTimerRef.current = setTimeout(() => {
            setLastSuccess(null)
            setIsSelfPractice(true)
            setStepIndex(0)
            setStage('DO_IT_MYSELF')
            speak('اب بغیر کسی اشارے کے خود مکمل سبق دہرائیں۔')
          }, 1500)
        } else {
          // Auto-advance to next step in guided mode (remains interactive and tryable!)
          advanceTimerRef.current = setTimeout(() => {
            setLastSuccess(null)
            setStepIndex((idx) => idx + 1)
            setStage('LET_ME_TRY')
          }, 1500)
        }
      } else {
        // "Let Me Do It Myself" phase
        if (isLastStep) {
          // Entire lesson finished!
          advanceTimerRef.current = setTimeout(() => {
            setLastSuccess(null)
            setStage('DONE')
            speak('مبارک ہو! آپ نے پورا سبق کامیابی سے مکمل کر لیا ہے۔')
            const lessonKey = `lesson_${lesson.title_en || 'custom'}_${Date.now()}`
            markComplete(lessonKey, {
              titleEn: lesson.title_en,
              titleUr: lesson.title_ur,
            })
          }, 1500)
        } else {
          advanceTimerRef.current = setTimeout(() => {
            setLastSuccess(null)
            setStepIndex((idx) => idx + 1)
            setStage('DO_IT_MYSELF')
          }, 1500)
        }
      }
    } else {
      // Incorrect button tapped -> Gentle correction (Correct Me)
      const hint = currentStep.hints?.[buttonId]
      const fallbackHint = {
        en: "That wasn't quite it, and that's okay. Let's try again.",
        ur: 'یہ بالکل درست نہیں تھا، اور کوئی بات نہیں۔ آئیں دوبارہ کوشش کریں۔',
      }
      const active = hint || fallbackHint
      setActiveHint(active)
      setStage('CORRECT_ME')

      // Speak gentle correction
      speak(active.ur)
    }
  }

  function retryStep() {
    setActiveHint(null)
    setStage(isSelfPractice ? 'DO_IT_MYSELF' : 'LET_ME_TRY')
    speak(currentStep.instruction_ur)
  }

  function restartLesson() {
    setStepIndex(0)
    setIsSelfPractice(false)
    setGuidedMode(false)
    setStage('SHOW_ME')
    setActiveHint(null)
    setLastSuccess(null)
    stop()
  }

  return (
    <div className="flex flex-col gap-3 md:gap-5">
      {/* Top Bar: Back Link & Stage Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => {
            stop()
            onNavigate('learn')
          }}
          className="flex min-h-9 items-center gap-1.5 text-sm font-semibold text-action hover:underline"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <BilingualText as="span" en="Back to Learn & Practise" ur="واپس سیکھیں اور مشق کریں" />
        </button>

        {stage !== 'DONE' && (
          <span className="rounded-full bg-mint-strong px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
            {stage === 'SHOW_ME' && 'Stage 1: Show Me / مجھے دکھائیں'}
            {stage === 'LET_ME_TRY' && 'Stage 2: Let Me Try / اب آپ آزمائیں'}
            {stage === 'CORRECT_ME' && 'Stage 3: Correct Me / دوستانہ رہنمائی'}
            {stage === 'DO_IT_MYSELF' && 'Stage 4: Let Me Do It Myself / خود کریں'}
          </span>
        )}
      </div>

      {/* Preset Notice if AI is unavailable */}
      {lesson.source === 'preset' && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-900 text-xs">
          <AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={16} />
          <div>
            <p className="font-semibold">
              {lesson.note_en || 'AI lesson unavailable, showing a sample lesson.'}
            </p>
            <p lang="ur" dir="rtl" className="urdu font-semibold text-xs">
              {lesson.note_ur || 'اے آئی سبق دستیاب نہیں، نمونہ سبق دکھایا جا رہا ہے۔'}
            </p>
          </div>
        </div>
      )}

      {/* Speech Voice Not Available Notice (shown ONCE if speech is checked and unavailable) */}
      {speechChecked && !speechAvailable && (
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-2.5 text-ink text-xs shadow-xs">
          <AlertTriangle className="mt-0.5 shrink-0 text-action" size={16} />
          <div>
            <p className="font-semibold text-primary">
              Voice is not available on this device. Please read the instructions on screen.
            </p>
            <p lang="ur" dir="rtl" className="urdu font-semibold text-xs text-primary">
              اس ڈیوائس پر اردو آواز دستیاب نہیں۔ براہ کرم اسکرین پر ہدایات پڑھیں۔
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              Tip: Try Microsoft Edge, or add Urdu speech in Windows language settings / ایج براؤزر آزمائیں یا ونڈوز میں اردو آواز شامل کریں
            </p>
          </div>
        </div>
      )}

      {/* Main Player Grid */}
      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
        {/* Left Column (Desktop) / Top Section (Mobile): Instructions & Controls */}
        <div className="flex flex-col gap-3 lg:col-span-6">
          {/* Lesson Title */}
          <div>
            <BilingualText
              en={lesson.title_en}
              ur={lesson.title_ur}
              enClass="text-xl md:text-2xl font-bold text-primary leading-tight"
              urClass="text-lg md:text-xl font-bold text-primary leading-tight"
            />
          </div>

          {/* Compact Progress Bar */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-muted">
              <span>Step {stepNumber} of {totalSteps}</span>
              <span lang="ur" dir="rtl" className="urdu text-xs">مرحلہ {stepNumber} از {totalSteps}</span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((stepNumber / totalSteps) * 100)}
              className="h-2 w-full rounded-full bg-mint-strong"
            >
              <div
                className="h-2 rounded-full bg-action transition-all duration-300"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Compact Instruction Card with Voice Controls */}
          {stage !== 'DONE' && (
            <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <BilingualText
                    en={currentStep.instruction_en}
                    ur={currentStep.instruction_ur}
                    enClass="text-base text-ink font-semibold"
                    urClass="text-base text-primary font-bold"
                  />
                </div>

                {/* Audio Controls Toolbar */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={replay}
                    title="Repeat voice / دوبارہ سنیں"
                    aria-label="Repeat Urdu voice"
                    className="flex h-8 items-center gap-1 rounded-lg border border-line bg-white px-2 text-xs font-medium text-action hover:bg-mint active:scale-95 disabled:opacity-40"
                    disabled={!speechAvailable}
                  >
                    <RotateCcw size={14} className={speechStatus === 'speaking' ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">Repeat</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute voice' : 'Mute voice'}
                    aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      isMuted
                        ? 'border-danger/30 bg-red-50 text-danger'
                        : 'border-line bg-white text-action hover:bg-mint'
                    }`}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              </div>

              {/* Step 1 Show Me Action Button: "Let Me Try" */}
              {stage === 'SHOW_ME' && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                  <p className="text-xs font-medium text-amber-900 mb-2">
                    <span lang="en">Look at the highlighted button on the phone, then tap below:</span>
                    <br />
                    <span lang="ur" dir="rtl" className="urdu text-xs block mt-0.5">فون پر نمایاں بٹن دیکھیں، پھر نیچے دبائیں:</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleStartGuidedPractice}
                    className="flex min-h-11 w-full items-center justify-center rounded-xl bg-action px-4 py-2 font-bold text-white shadow-xs hover:bg-primary active:scale-[0.98]"
                  >
                    <BilingualText as="span" center en="Let Me Try" ur="اب میں آزماتا ہوں" />
                  </button>
                </div>
              )}

              {/* Guided Mode Info Badge */}
              {stage === 'LET_ME_TRY' && !isSelfPractice && (
                <div className="mt-2 text-center text-xs font-semibold text-action">
                  <span>Tap the highlighted button directly on the simulated phone / فون پر نمایاں بٹن دبائیں</span>
                </div>
              )}

              {/* Self Practice Badge */}
              {stage === 'DO_IT_MYSELF' && (
                <div className="mt-2 text-center text-xs font-semibold text-primary">
                  <span>Practise independently without highlights / بغیر اشارے کے خود کوشش کریں</span>
                </div>
              )}
            </div>
          )}

          {/* Correct Me stage: Gentle Hint & Try Again button */}
          {stage === 'CORRECT_ME' && activeHint && (
            <div className="flex flex-col gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 shadow-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 shrink-0 text-amber-700" size={18} />
                <BilingualText
                  en={activeHint.en}
                  ur={activeHint.ur}
                  enClass="text-sm text-amber-900 font-semibold"
                  urClass="text-sm text-amber-900 font-bold"
                />
              </div>
              <button
                type="button"
                onClick={retryStep}
                className="min-h-10 w-full rounded-xl bg-action px-4 py-2 font-bold text-white shadow-xs hover:bg-primary active:scale-[0.98]"
              >
                <BilingualText as="span" center en="Try Again" ur="دوبارہ کوشش کریں" />
              </button>
            </div>
          )}

          {/* Success Banner */}
          {lastSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 text-emerald-900 animate-fadeIn">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <div>
                <p className="text-xs font-bold">{lastSuccess.en}</p>
                <p lang="ur" dir="rtl" className="urdu text-xs font-bold">{lastSuccess.ur}</p>
              </div>
            </div>
          )}

          {/* Completed State */}
          {stage === 'DONE' && (
            <div className="flex flex-col gap-3 rounded-2xl bg-mint-strong p-4.5 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-action shrink-0" size={24} />
                <BilingualText
                  en="You did it!"
                  ur="آپ نے کر دکھایا!"
                  enClass="text-xl font-bold text-primary"
                  urClass="text-xl font-bold text-primary"
                />
              </div>
              <BilingualText
                en="You completed the entire practice lesson including independent trial."
                ur="آپ نے آزادانہ مشق سمیت پورا مشقی سبق کامیابی سے مکمل کر لیا ہے۔"
                enClass="text-xs text-ink"
                urClass="text-sm text-ink"
              />
              <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate('progress')}
                  className="min-h-10 flex-1 rounded-xl bg-action px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-primary active:scale-[0.98]"
                >
                  <BilingualText as="span" center en="View Progress" ur="کارکردگی دیکھیں" />
                </button>
                <button
                  type="button"
                  onClick={restartLesson}
                  className="min-h-10 flex-1 rounded-xl border border-action px-4 py-2 text-sm font-bold text-action hover:bg-mint active:scale-[0.98]"
                >
                  <BilingualText as="span" center en="Practise Again" ur="دوبارہ مشق کریں" />
                </button>
              </div>
            </div>
          )}

          {/* Guidance Disclaimer */}
          <div className="hidden border-t border-line pt-2 text-[11px] text-muted lg:block">
            <p>{lesson.disclaimer_en}</p>
            <p lang="ur" dir="rtl" className="urdu text-[11px]">{lesson.disclaimer_ur}</p>
          </div>
        </div>

        {/* Right Column (Desktop) / Main Area (Mobile): Simulated Phone */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <PhoneSimulator
            screen={currentStep.screen}
            appName={currentStep.app_name}
            buttons={currentStep.buttons}
            highlight={highlightId}
            interactive={isInteractive}
            onAction={handleButtonAction}
          />
        </div>

        {/* Mobile Disclaimer (placed at bottom on mobile) */}
        <div className="border-t border-line pt-2 text-[11px] text-muted lg:hidden text-center">
          <p>{lesson.disclaimer_en}</p>
          <p lang="ur" dir="rtl" className="urdu text-[11px]">{lesson.disclaimer_ur}</p>
        </div>
      </div>
    </div>
  )
}
