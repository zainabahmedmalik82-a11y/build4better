import { useState, useEffect, useRef, useCallback } from 'react'

export default function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [voice, setVoice] = useState(null)
  const [checked, setChecked] = useState(!supported)
  const [status, setStatus] = useState('idle') // idle | speaking | paused
  const lastText = useRef('')

  useEffect(() => {
    if (!supported) return
    const synth = window.speechSynthesis
    const load = () => {
      const list = synth.getVoices()
      setVoice(list.find((v) => v.lang.toLowerCase().startsWith('ur')) || null)
      if (list.length > 0) setChecked(true)
    }
    load()
    synth.addEventListener('voiceschanged', load)
    const t = setTimeout(() => setChecked(true), 1500)
    return () => {
      synth.removeEventListener('voiceschanged', load)
      clearTimeout(t)
      synth.cancel()
    }
  }, [supported])

  const speak = useCallback((text) => {
    if (!supported || !voice) return
    const synth = window.speechSynthesis
    synth.cancel()
    lastText.current = text
    const u = new SpeechSynthesisUtterance(text)
    u.voice = voice
    u.lang = voice.lang
    u.onend = () => setStatus('idle')
    u.onerror = () => setStatus('idle')
    synth.speak(u)
    setStatus('speaking')
  }, [supported, voice])

  const togglePause = useCallback(() => {
    if (!supported) return
    const synth = window.speechSynthesis
    if (status === 'speaking') { synth.pause(); setStatus('paused') }
    else if (status === 'paused') { synth.resume(); setStatus('speaking') }
  }, [supported, status])

  const replay = useCallback(() => speak(lastText.current), [speak])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setStatus('idle')
  }, [supported])

  return { speak, togglePause, replay, stop, status, available: !!voice, checked, supported }
}