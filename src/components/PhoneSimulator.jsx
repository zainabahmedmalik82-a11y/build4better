import { Video, Phone, PhoneOff, MicOff, ArrowLeft } from 'lucide-react'
import BilingualText from './BilingualText'

function Control({ id, label, highlight, interactive, onAction, className = '', children }) {
  const isTarget = highlight === id
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!interactive}
      onClick={() => onAction(id)}
      className={`rounded-xl disabled:cursor-default ${
        isTarget ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white' : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}

function Avatar({ letter, big = false }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-mint-strong font-semibold text-primary ${
        big ? 'h-24 w-24 text-4xl' : 'h-11 w-11 text-lg'
      }`}
    >
      {letter}
    </span>
  )
}

function ChatsScreen(props) {
  return (
    <div className="flex h-full flex-col bg-white text-ink">
      <div className="bg-action px-4 py-3 text-lg font-semibold text-white">Chats</div>
      <Control id="open-ayesha" label="Open chat with Ayesha" {...props}
        className="flex items-center gap-3 border-b border-line p-3 text-left">
        <Avatar letter="A" />
        <span className="block">
          <span className="block font-semibold">Ayesha</span>
          <span className="block text-sm text-muted">Shall we video call?</span>
        </span>
      </Control>
      <Control id="open-bilal" label="Open chat with Bilal" {...props}
        className="flex items-center gap-3 border-b border-line p-3 text-left">
        <Avatar letter="B" />
        <span className="block">
          <span className="block font-semibold">Bilal</span>
          <span className="block text-sm text-muted">See you tomorrow</span>
        </span>
      </Control>
    </div>
  )
}

function ChatScreen(props) {
  return (
    <div className="flex h-full flex-col bg-mint">
      <div className="flex items-center gap-2 bg-action px-3 py-2 text-white">
        <ArrowLeft size={20} aria-hidden="true" />
        <Avatar letter="A" />
        <span className="flex-1 font-semibold">Ayesha</span>
        <Control id="audio-btn" label="Audio call" {...props}
          className="flex flex-col items-center px-2 py-1 text-white">
          <Phone size={22} aria-hidden="true" />
          <span className="text-[11px]">Audio</span>
        </Control>
        <Control id="video-btn" label="Video call" {...props}
          className="flex flex-col items-center px-2 py-1 text-white">
          <Video size={22} aria-hidden="true" />
          <span className="text-[11px]">Video</span>
        </Control>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 text-sm">
        <p className="max-w-[80%] self-start rounded-xl bg-white p-2">Salam! What are you doing tomorrow?</p>
        <p className="max-w-[80%] self-end rounded-xl bg-mint-strong p-2">Walaikum salam, I am free.</p>
        <p className="max-w-[80%] self-start rounded-xl bg-white p-2">Shall we video call? I want to see you!</p>
      </div>
      <div className="m-2 rounded-full bg-white px-4 py-2 text-sm text-muted">Type a message (practice)</div>
    </div>
  )
}

function VideoScreen(props) {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-primary p-6 text-white">
      <div className="mt-8 flex flex-col items-center gap-3">
        <Avatar letter="A" big />
        <span className="text-xl font-semibold">Ayesha</span>
        <span className="text-sm opacity-90">Practice video call</span>
      </div>
      <div className="mb-4 flex items-center gap-6">
        <Control id="mute-btn" label="Mute microphone" {...props}
          className="flex h-14 w-14 items-center justify-center bg-white/20">
          <MicOff size={24} aria-hidden="true" />
        </Control>
        <Control id="end-btn" label="End call" {...props}
          className="flex h-16 w-16 items-center justify-center bg-danger">
          <PhoneOff size={28} aria-hidden="true" />
        </Control>
      </div>
    </div>
  )
}

export default function PhoneSimulator({ screen, highlight, interactive, onAction }) {
  const props = { highlight, interactive, onAction }
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="mb-3 text-sm text-muted">
        <BilingualText center
          en="Practice phone. Not connected to real WhatsApp."
          ur="مشقی فون۔ اصلی واٹس ایپ سے نہیں جڑا۔" />
      </div>
      <div className="overflow-hidden rounded-[2.5rem] border-8 border-primary bg-white shadow-lg">
        <div className="flex justify-between bg-primary px-5 py-1 text-xs text-white">
          <span>9:41</span>
          <span>PRACTICE</span>
        </div>
        <div className="h-[500px]">
          {screen === 'chats' && <ChatsScreen {...props} />}
          {screen === 'chat' && <ChatScreen {...props} />}
          {screen === 'video' && <VideoScreen {...props} />}
        </div>
      </div>
    </div>
  )
}