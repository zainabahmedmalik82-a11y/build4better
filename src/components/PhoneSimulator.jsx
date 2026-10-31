import { Video, Phone, PhoneOff, MicOff, ArrowLeft } from 'lucide-react'
import BilingualText from './BilingualText'

function LegacyControl({ id, label, highlight, interactive, onAction, className = '', children }) {
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

function LegacyAvatar({ letter, big = false }) {
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

function LegacyChatsScreen(props) {
  return (
    <div className="flex h-full flex-col bg-white text-ink">
      <div className="bg-action px-4 py-3 text-lg font-semibold text-white">Chats</div>
      <LegacyControl id="open-ayesha" label="Open chat with Ayesha" {...props}
        className="flex items-center gap-3 border-b border-line p-3 text-left">
        <LegacyAvatar letter="A" />
        <span className="block">
          <span className="block font-semibold">Ayesha</span>
          <span className="block text-sm text-muted">Shall we video call?</span>
        </span>
      </LegacyControl>
      <LegacyControl id="open-bilal" label="Open chat with Bilal" {...props}
        className="flex items-center gap-3 border-b border-line p-3 text-left">
        <LegacyAvatar letter="B" />
        <span className="block">
          <span className="block font-semibold">Bilal</span>
          <span className="block text-sm text-muted">See you tomorrow</span>
        </span>
      </LegacyControl>
    </div>
  )
}

function LegacyChatScreen(props) {
  return (
    <div className="flex h-full flex-col bg-mint">
      <div className="flex items-center gap-2 bg-action px-3 py-2 text-white">
        <ArrowLeft size={20} aria-hidden="true" />
        <LegacyAvatar letter="A" />
        <span className="flex-1 font-semibold">Ayesha</span>
        <LegacyControl id="audio-btn" label="Audio call" {...props}
          className="flex flex-col items-center px-2 py-1 text-white">
          <Phone size={22} aria-hidden="true" />
          <span className="text-[11px]">Audio</span>
        </LegacyControl>
        <LegacyControl id="video-btn" label="Video call" {...props}
          className="flex flex-col items-center px-2 py-1 text-white">
          <Video size={22} aria-hidden="true" />
          <span className="text-[11px]">Video</span>
        </LegacyControl>
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

function LegacyVideoScreen(props) {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-primary p-6 text-white">
      <div className="mt-8 flex flex-col items-center gap-3">
        <LegacyAvatar letter="A" big />
        <span className="text-xl font-semibold">Ayesha</span>
        <span className="text-sm opacity-90">Practice video call</span>
      </div>
      <div className="mb-4 flex items-center gap-6">
        <LegacyControl id="mute-btn" label="Mute microphone" {...props}
          className="flex h-14 w-14 items-center justify-center bg-white/20">
          <MicOff size={24} aria-hidden="true" />
        </LegacyControl>
        <LegacyControl id="end-btn" label="End call" {...props}
          className="flex h-16 w-16 items-center justify-center bg-danger">
          <PhoneOff size={28} aria-hidden="true" />
        </LegacyControl>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Generic Screen Templates for AI-Generated Lessons                           */
/* -------------------------------------------------------------------------- */

function GenericButton({ button, isTarget, interactive, onClick }) {
  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={() => onClick(button.id)}
      className={`group flex min-h-[54px] w-full flex-col items-center justify-center rounded-2xl border-2 p-3 text-center shadow-xs transition-all disabled:cursor-not-allowed ${
        isTarget
          ? 'animate-pulse border-amber-400 bg-amber-50 ring-4 ring-amber-400 ring-offset-2'
          : 'border-line bg-white hover:border-action hover:bg-mint/30 active:scale-[0.98]'
      }`}
    >
      <span className="font-semibold text-primary">{button.label_en}</span>
      <span lang="ur" dir="rtl" className="urdu text-sm font-medium text-action">
        {button.label_ur}
      </span>
    </button>
  )
}

function GenericHomeScreen({ appName, buttons = [], highlight, interactive, onAction }) {
  return (
    <div className="flex h-full flex-col justify-between bg-slate-50 p-4">
      <div>
        <div className="mb-4 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">Home Screen / ہوم اسکرین</p>
          <p className="text-base font-bold text-primary">{appName || 'Smartphone'}</p>
        </div>
        <div className="flex flex-col gap-3">
          {buttons.map((btn) => (
            <GenericButton
              key={btn.id}
              button={btn}
              isTarget={highlight === btn.id}
              interactive={interactive}
              onClick={onAction}
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-line bg-white p-2.5 text-center text-xs text-muted shadow-xs">
        <span lang="en">Select the required action</span>
        <span className="mx-1">•</span>
        <span lang="ur" dir="rtl" className="urdu">مطلوبہ بٹن منتخب کریں</span>
      </div>
    </div>
  )
}

function GenericAppScreen({ appName, buttons = [], highlight, interactive, onAction }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 bg-action px-4 py-3 text-white shadow-xs">
        <div className="h-2.5 w-2.5 rounded-full bg-white/60" />
        <span className="font-semibold">{appName || 'Application'}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="mb-4 rounded-xl bg-mint/50 p-3 text-center text-xs font-medium text-primary">
            <span lang="en">Choose the next step inside {appName || 'the app'}</span>
          </div>
          <div className="flex flex-col gap-3">
            {buttons.map((btn) => (
              <GenericButton
                key={btn.id}
                button={btn}
                isTarget={highlight === btn.id}
                interactive={interactive}
                onClick={onAction}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-line p-2 text-center text-[11px] text-muted">
          <span>Safe Learning Sandbox • محفوظ مشقی ماحول</span>
        </div>
      </div>
    </div>
  )
}

function GenericChatScreen({ appName, buttons = [], highlight, interactive, onAction }) {
  return (
    <div className="flex h-full flex-col bg-mint/20">
      <div className="flex items-center gap-3 bg-action px-4 py-3 text-white shadow-xs">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-action">
          A
        </div>
        <div>
          <span className="block font-semibold">Ayesha (عائشہ)</span>
          <span className="block text-[11px] text-white/80">{appName || 'Chat'}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="flex flex-col gap-2.5">
          <div className="max-w-[85%] self-start rounded-2xl rounded-tl-xs border border-line bg-white p-3 shadow-xs">
            <p className="text-xs font-semibold text-muted">Ayesha:</p>
            <p className="text-sm text-ink">Salam! What should we do next?</p>
            <p lang="ur" dir="rtl" className="urdu text-xs text-muted">سلام! اب ہمیں کیا کرنا چاہیے؟</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-white/90 p-2.5 shadow-xs">
          {buttons.map((btn) => (
            <GenericButton
              key={btn.id}
              button={btn}
              isTarget={highlight === btn.id}
              interactive={interactive}
              onClick={onAction}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function GenericFormScreen({ appName, buttons = [], highlight, interactive, onAction }) {
  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="bg-action px-4 py-3 font-semibold text-white shadow-xs">
        {appName || 'Form'} — Practice Form / مشقی فارم
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex flex-col gap-2.5">
          {/* Decorative read-only sample fields - no real data entry */}
          <div className="rounded-xl border border-line bg-white p-2.5 text-xs shadow-xs">
            <span className="block font-medium text-muted">Recipient / وصول کنندہ (Sample):</span>
            <span className="block font-semibold text-primary">Ayesha Bibi (عائشہ بی بی)</span>
          </div>
          <div className="rounded-xl border border-line bg-white p-2.5 text-xs shadow-xs">
            <span className="block font-medium text-muted">Amount / رقم (Sample):</span>
            <span className="block font-semibold text-primary">Rs. 500 (پانچ سو روپے)</span>
          </div>
          <div className="rounded-xl border border-line bg-white p-2.5 text-xs shadow-xs">
            <span className="block font-medium text-muted">Security PIN / سیکیورٹی پن:</span>
            <span className="block font-mono text-muted">•••• (Entered privately in real app)</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {buttons.map((btn) => (
            <GenericButton
              key={btn.id}
              button={btn}
              isTarget={highlight === btn.id}
              interactive={interactive}
              onClick={onAction}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PhoneSimulator({
  screen = 'home',
  appName = '',
  buttons = [],
  highlight,
  interactive,
  onAction,
}) {
  const isGeneric = Array.isArray(buttons) && buttons.length > 0
  const legacyProps = { highlight, interactive, onAction }

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="mb-3 text-center text-sm text-muted">
        <BilingualText
          center
          en="Practice phone. Safe simulation."
          ur="مشقی فون۔ محفوظ ماحول۔"
        />
      </div>
      <div className="overflow-hidden rounded-[2.5rem] border-8 border-primary bg-white shadow-xl">
        <div className="flex justify-between bg-primary px-5 py-1.5 text-xs text-white">
          <span>9:41</span>
          <span className="font-semibold tracking-wider">SIMULATOR</span>
          <span>100%</span>
        </div>
        <div className="h-[520px] overflow-y-auto">
          {isGeneric ? (
            <>
              {screen === 'home' && (
                <GenericHomeScreen
                  appName={appName}
                  buttons={buttons}
                  highlight={highlight}
                  interactive={interactive}
                  onAction={onAction}
                />
              )}
              {screen === 'app' && (
                <GenericAppScreen
                  appName={appName}
                  buttons={buttons}
                  highlight={highlight}
                  interactive={interactive}
                  onAction={onAction}
                />
              )}
              {screen === 'chat' && (
                <GenericChatScreen
                  appName={appName}
                  buttons={buttons}
                  highlight={highlight}
                  interactive={interactive}
                  onAction={onAction}
                />
              )}
              {screen === 'form' && (
                <GenericFormScreen
                  appName={appName}
                  buttons={buttons}
                  highlight={highlight}
                  interactive={interactive}
                  onAction={onAction}
                />
              )}
              {screen !== 'home' && screen !== 'app' && screen !== 'chat' && screen !== 'form' && (
                <GenericAppScreen
                  appName={appName}
                  buttons={buttons}
                  highlight={highlight}
                  interactive={interactive}
                  onAction={onAction}
                />
              )}
            </>
          ) : (
            <>
              {screen === 'chats' && <LegacyChatsScreen {...legacyProps} />}
              {screen === 'chat' && <LegacyChatScreen {...legacyProps} />}
              {screen === 'video' && <LegacyVideoScreen {...legacyProps} />}
              {screen !== 'chats' && screen !== 'chat' && screen !== 'video' && (
                <LegacyChatsScreen {...legacyProps} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
