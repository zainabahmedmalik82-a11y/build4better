import { useEffect } from 'react'
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import useSpeech from '../hooks/useSpeech'
import BilingualText from './BilingualText'

export default function VoiceControls({ text }) {
  const { speak, replay, stop, toggleMute, isMuted, available, checked } = useSpeech()

  useEffect(() => {
    return () => stop()
  }, [text, stop])

  if (checked && !available) {
    return (
      <p className="mt-2 text-xs text-muted">
        <span lang="en" dir="ltr">Voice is not available on this device.</span>{' '}
        <span lang="ur" dir="rtl" className="urdu text-xs">اس ڈیوائس پر آواز دستیاب نہیں۔</span>
      </p>
    )
  }

  const btn = 'flex min-h-9 items-center gap-1.5 rounded-lg border border-action px-3 py-1 text-xs font-semibold text-action hover:bg-mint disabled:opacity-40 transition-colors'
  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      <button className={btn} disabled={!available} onClick={() => speak(text)}>
        <Play size={14} aria-hidden="true" />
        <BilingualText as="span" en="Play Urdu Voice" ur="آواز سنیں" />
      </button>
      <button className={btn} disabled={!available} onClick={replay}>
        <RotateCcw size={14} aria-hidden="true" />
        <BilingualText as="span" en="Replay" ur="دوبارہ" />
      </button>
      <button className={btn} onClick={toggleMute}>
        {isMuted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
        <BilingualText as="span" en={isMuted ? 'Unmute' : 'Mute'} ur={isMuted ? 'آواز کھولیں' : 'آواز بند کریں'} />
      </button>
    </div>
  )
}
