import { Video, Phone, PhoneOff, MicOff, ArrowLeft } from 'lucide-react'

function LegacyControl({ id, label, highlight, interactive, onAction, className = '', children }) {
  const isTarget = highlight === id
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!interactive}
      onClick={() => onAction(id)}
      className={`rounded-xl transition-all disabled:cursor-default ${
        isTarget ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white animate-pulse' : ''
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
        big ? 'h-20 w-20 text-3xl' : 'h-10 w-10 text-base'
      }`}
    >
      {letter}
    </span>
  )
}

function LegacyChatsScreen(props) {
  return (
    <div className="flex flex-1 flex-col bg-white text-ink">
      <div className="bg-action px-4 py-3 text-base font-semibold text-white">Chats</div>
      <LegacyControl id="open-ayesha" label="Open chat with Ayesha" {...props}
        className="flex items-center gap-3 border-b border-line p-3 text-left">
        <LegacyAvatar letter="A" />
        <span className="block">
          <span className="block text-base font-bold text-ink">Ayesha</span>
          <span className="block text-xs text-muted">Shall we video call?</span>
        </span>
      </LegacyControl>
      <LegacyControl id="open-bilal" label="Open chat with Bilal" {...props}
        className="flex items-center gap-3 border-b border-line p-3 text-left">
        <LegacyAvatar letter="B" />
        <span className="block">
          <span className="block text-base font-bold text-ink">Bilal</span>
          <span className="block text-xs text-muted">See you tomorrow</span>
        </span>
      </LegacyControl>
    </div>
  )
}

function LegacyChatScreen(props) {
  return (
    <div className="flex flex-1 flex-col bg-mint/40">
      <div className="flex items-center gap-2.5 bg-action px-3 py-2.5 text-white shrink-0">
        <ArrowLeft size={18} aria-hidden="true" />
        <LegacyAvatar letter="A" />
        <span className="flex-1 text-sm font-semibold">Ayesha</span>
        <LegacyControl id="audio-btn" label="Audio call" {...props}
          className="flex flex-col items-center px-2 py-0.5 text-white">
          <Phone size={18} aria-hidden="true" />
          <span className="text-[10px]">Audio</span>
        </LegacyControl>
        <LegacyControl id="video-btn" label="Video call" {...props}
          className="flex flex-col items-center px-2 py-0.5 text-white">
          <Video size={18} aria-hidden="true" />
          <span className="text-[10px]">Video</span>
        </LegacyControl>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 text-xs">
        <p className="max-w-[85%] self-start rounded-xl bg-white p-2.5 shadow-xs">Salam! What are you doing tomorrow?</p>
        <p className="max-w-[85%] self-end rounded-xl bg-mint-strong p-2.5 shadow-xs">Walaikum salam, I am free.</p>
        <p className="max-w-[85%] self-start rounded-xl bg-white p-2.5 shadow-xs">Shall we video call? I want to see you!</p>
      </div>
      <div className="m-3 rounded-full bg-white px-3 py-2 text-xs text-muted text-center shadow-xs">
        Type a message (practice)
      </div>
    </div>
  )
}

function LegacyVideoScreen(props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between bg-primary p-6 text-white">
      <div className="mt-8 flex flex-col items-center gap-3">
        <LegacyAvatar letter="A" big />
        <span className="text-xl font-bold">Ayesha</span>
        <span className="text-xs opacity-90">Practice video call</span>
      </div>
      <div className="mb-6 flex items-center gap-6">
        <LegacyControl id="mute-btn" label="Mute microphone" {...props}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <MicOff size={22} aria-hidden="true" />
        </LegacyControl>
        <LegacyControl id="end-btn" label="End call" {...props}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-danger">
          <PhoneOff size={24} aria-hidden="true" />
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
      className={`group flex min-h-[50px] w-full flex-col items-center justify-center rounded-xl border-2 p-2.5 text-center transition-all disabled:cursor-not-allowed ${
        isTarget
          ? 'border-amber-500 bg-amber-100 shadow-md ring-4 ring-amber-400 ring-offset-1 animate-pulse'
          : 'border-line bg-white hover:border-action hover:bg-mint/30 active:scale-[0.98]'
      }`}
    >
      <span className={`font-bold text-sm ${isTarget ? 'text-ink' : 'text-primary'}`}>
        {button.label_en}
      </span>
      <span
        lang="ur"
        dir="rtl"
        className={`urdu text-xs font-bold leading-tight ${isTarget ? 'text-[#173B35]' : 'text-action'}`}
      >
        {button.label_ur}
      </span>
    </button>
  )
}

function GenericHomeScreen({ appName, buttons = [], highlight, interactive, onAction }) {
  return (
    <div className="flex flex-1 flex-col justify-between bg-slate-50 p-4">
      <div>
        <div className="mb-3 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Home Screen / ہوم اسکرین</p>
          <p className="text-base font-bold text-primary">{appName || 'Smartphone'}</p>
        </div>
        <div className="flex flex-col gap-2.5">
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
      <div className="mt-4 rounded-xl border border-line bg-white p-2 text-center text-xs text-muted shadow-xs">
        <span lang="en">Select the required action</span>
        <span className="mx-1">•</span>
        <span lang="ur" dir="rtl" className="urdu text-xs">مطلوبہ بٹن منتخب کریں</span>
      </div>
    </div>
  )
}

function GenericAppScreen({ appName, buttons = [], highlight, interactive, onAction }) {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex items-center gap-2 bg-action px-4 py-2.5 text-white shadow-xs shrink-0">
        <div className="h-2 w-2 rounded-full bg-white/70" />
        <span className="text-sm font-bold">{appName || 'Application'}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="mb-3 rounded-xl bg-mint/50 p-2 text-center text-xs font-semibold text-primary">
            <span lang="en">Choose next step in {appName || 'app'}</span>
          </div>
          <div className="flex flex-col gap-2.5">
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
        <div className="mt-4 rounded-xl border border-dashed border-line p-2 text-center text-[11px] text-muted">
          <span>Safe Learning Sandbox • محفوظ مشقی ماحول</span>
        </div>
      </div>
    </div>
  )
}

function GenericChatScreen({ appName, buttons = [], highlight, interactive, onAction }) {
  return (
    <div className="flex flex-1 flex-col bg-mint/20">
      <div className="flex items-center gap-2.5 bg-action px-3.5 py-2.5 text-white shadow-xs shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-action text-xs">
          A
        </div>
        <div>
          <span className="block text-xs font-bold">Ayesha (عائشہ)</span>
          <span className="block text-[10px] text-white/80">{appName || 'Chat'}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div className="flex flex-col gap-2">
          <div className="max-w-[85%] self-start rounded-xl rounded-tl-xs border border-line bg-white p-2.5 shadow-xs">
            <p className="text-[11px] font-bold text-muted">Ayesha:</p>
            <p className="text-sm text-ink font-medium">Salam! What should we do next?</p>
            <p lang="ur" dir="rtl" className="urdu text-xs text-muted">سلام! اب ہمیں کیا کرنا چاہیے؟</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-line bg-white/90 p-2.5 shadow-xs">
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
    <div className="flex flex-1 flex-col bg-slate-50">
      <div className="bg-action px-4 py-2.5 text-xs font-bold text-white shadow-xs shrink-0">
        {appName || 'Form'} — Practice Form / مشقی فارم
      </div>
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div className="flex flex-col gap-2">
          <div className="rounded-xl border border-line bg-white p-2.5 text-xs shadow-xs">
            <span className="block font-medium text-muted text-[11px]">Recipient / وصول کنندہ:</span>
            <span className="block font-bold text-primary">Ayesha Bibi (عائشہ بی بی)</span>
          </div>
          <div className="rounded-xl border border-line bg-white p-2.5 text-xs shadow-xs">
            <span className="block font-medium text-muted text-[11px]">Amount / رقم:</span>
            <span className="block font-bold text-primary">Rs. 500 (پانچ سو روپے)</span>
          </div>
          <div className="rounded-xl border border-line bg-white p-2.5 text-xs shadow-xs">
            <span className="block font-medium text-muted text-[11px]">Security PIN / پن:</span>
            <span className="block font-mono text-muted text-xs">•••• (Simulated)</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
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
    <div className="mx-auto w-full max-w-full sm:max-w-[320px]">
      <div className="mb-1.5 text-center text-xs text-muted font-medium">
        <span lang="en">Practice phone • </span>
        <span lang="ur" dir="rtl" className="urdu text-xs">محفوظ مشقی فون</span>
      </div>
      <div className="flex h-[78vh] md:h-[640px] flex-col overflow-hidden rounded-[2.2rem] md:rounded-[2.5rem] border-[5px] md:border-[6px] border-primary bg-white shadow-xl">
        <div className="flex shrink-0 justify-between bg-primary px-4 py-1.5 text-[11px] text-white">
          <span>9:41</span>
          <span className="font-bold tracking-wider">SIMULATOR</span>
          <span>100%</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
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
