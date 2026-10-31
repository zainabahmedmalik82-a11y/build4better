import { useState, useEffect, useRef, useCallback } from 'react'

const SESSION_MUTE_KEY = 'sahaara_speech_muted'

export default function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [voice, setVoice] = useState(null)
  const [checked, setChecked] = useState(!supported)
  const [status, setStatus] = useState('idle') // 'idle' | 'speaking' | 'paused'
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_MUTE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const lastTextRef = useRef('')

  useEffect(() => {
    if (!supported) {
      setChecked(true)
      return
    }

    const synth = window.speechSynthesis

    const findUrduVoice = () => {
      try {
        const voices = synth.getVoices()
        if (!voices || voices.length === 0) return

        const urduVoices = voices.filter(
          (v) => v.lang && v.lang.toLowerCase().startsWith('ur')
        )

        if (urduVoices.length > 0) {
          // Prefer female Urdu voice (e.g. Uzma, Gul, Zara, Sara, Fatima, etc.)
          const femaleVoice = urduVoices.find((v) =>
            /uzma|female|zara|sara|gul|fatima|woman|zira/i.test(v.name)
          )
          setVoice(femaleVoice || urduVoices[0])
        } else {
          setVoice(null)
        }
        setChecked(true)
      } catch {
        setChecked(true)
      }
    }

    findUrduVoice()
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = findUrduVoice
    }
    synth.addEventListener('voiceschanged', findUrduVoice)

    const timer = setTimeout(() => {
      findUrduVoice()
      setChecked(true)
    }, 1200)

    return () => {
      synth.removeEventListener('voiceschanged', findUrduVoice)
      clearTimeout(timer)
      try {
        synth.cancel()
      } catch {}
    }
  }, [supported])

  const stop = useCallback(() => {
    if (!supported) return
    try {
      window.speechSynthesis.cancel()
    } catch {}
    setStatus('idle')
  }, [supported])

  const speak = useCallback(
    (text) => {
      if (!supported || isMuted || !text) return
      const synth = window.speechSynthesis
      try {
        synth.cancel()
      } catch {}

      // If no Urdu voice exists, do not attempt to speak (avoids english robot voice)
      if (!voice) return

      lastTextRef.current = text
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.lang = 'ur-PK'
      utterance.rate = 0.9

      utterance.onstart = () => setStatus('speaking')
      utterance.onend = () => setStatus('idle')
      utterance.onerror = () => setStatus('idle')

      try {
        synth.speak(utterance)
      } catch {
        setStatus('idle')
      }
    },
    [supported, isMuted, voice]
  )

  const replay = useCallback(() => {
    if (lastTextRef.current) {
      speak(lastTextRef.current)
    }
  }, [speak])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev
      try {
        sessionStorage.setItem(SESSION_MUTE_KEY, String(next))
      } catch {}
      if (next && supported) {
        try {
          window.speechSynthesis.cancel()
        } catch {}
        setStatus('idle')
      }
      return next
    })
  }, [supported])

  return {
    speak,
    stop,
    replay,
    toggleMute,
    isMuted,
    status,
    available: !!voice,
    checked,
    supported,
    voiceName: voice?.name || null,
  }
}
