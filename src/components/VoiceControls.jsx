import { useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import useSpeech from '../hooks/useSpeech'
import BilingualText from './BilingualText'

export default function VoiceControls({ text }) {
  const { speak, togglePause, replay, stop, status, available, checked } = useSpeech()

  useEffect(() => { stop() }, [text, stop])

  if (checked && !available) {
    return (
      <p className="mt-3 text-sm text-muted">
        <span lang="en" dir="ltr">Voice is not available on this device. Please read the text.</span>{' '}
        <span lang="ur" dir="rtl" className="urdu">اس ڈیوائس پر آواز دستیاب نہیں۔ براہ کرم متن پڑھیں۔</span>
      </p>
    )
  }

  const btn = 'flex min-h-12 items-center gap-2 rounded-xl border border-action px-4 text-action hover:bg-mint disabled:opacity-40'
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button className={btn} disabled={!available} onClick={() => speak(text)}>
        <Play size={18} aria-hidden="true" />
        <BilingualText as="span" en="Play Urdu Voice" ur="آواز سنیں" />
      </button>
      <button className={btn} disabled={status === 'idle'} onClick={togglePause}>
        <Pause size={18} aria-hidden="true" />
        <BilingualText as="span" en={status === 'paused' ? 'Resume' : 'Pause'} ur={status === 'paused' ? 'جاری رکھیں' : 'روکیں'} />
      </button>
      <button className={btn} disabled={!available} onClick={replay}>
        <RotateCcw size={18} aria-hidden="true" />
        <BilingualText as="span" en="Replay" ur="دوبارہ" />
      </button>
    </div>
  )
}