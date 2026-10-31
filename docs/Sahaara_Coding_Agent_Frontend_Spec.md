# Sahaara Frontend Build Specification

> **Audience:** Coding agent implementing the Sahaara frontend\
> **Priority:** Build the working MVP exactly as specified. Do not spend
> time inventing extra features.\
> **Time budget:** 6 hours\
> **Product type:** Responsive bilingual web application

------------------------------------------------------------------------

## 0. Mission

Build **Sahaara**, a calm, accessible Digital Confidence Coach for
adults and older people who find everyday technology difficult or
intimidating.

The frontend must deliver two complete experiences:

1.  **Learn & Practise:** an interactive WhatsApp video-call lesson
    using a simulated phone interface and the Confidence Loop.
2.  **Scam Detective:** a message checker that displays risk indicators
    and safe next steps.

Also build a simple dashboard and a progress screen.

**Product promise:** Learn technology. Practise safely. Use it
confidently.

Do not build a native mobile app. Build a responsive web app that works
in desktop and mobile browsers.

## 1. Required technology

Use the following stack unless the repository already contains a working
equivalent:

-   React
-   Vite
-   JavaScript (do not introduce TypeScript unless the existing project
    already uses it)
-   Tailwind CSS
-   React Router only if it can be set up quickly; otherwise use simple
    state-based page navigation
-   Lucide React icons
-   Browser `SpeechSynthesis` API for optional Urdu voice playback
-   `localStorage` for lesson progress
-   `fetch` for backend requests

Do not add a database, authentication, Redux, a component library, or
complex animation dependencies.

## 2. First actions

1.  Inspect the existing repository before changing files.
2.  Preserve existing working setup and conventions.
3.  If the repository is empty, scaffold React + Vite.
4.  Install only required dependencies.
5.  Create the application shell, shared styles, and navigation first.
6.  Make every screen functional with local mock data before connecting
    the backend.
7.  Do not block frontend development while waiting for backend
    endpoints.

If the backend URL is not known, use an environment variable:

``` env
VITE_API_BASE_URL=http://localhost:8000
```

Never put secret API keys in frontend environment variables or browser
code. Only the backend may hold the Groq API key.

## 3. Product and visual design

### 3.1 Visual direction

The interface should feel:

-   Welcoming, calm, trustworthy, patient, and simple.
-   Designed for people who may not be confident with technology.
-   Clear rather than flashy.
-   Comfortable to read and use on a phone.

Avoid:

-   Dense dashboards and tiny text.
-   Excessive gradients, glassmorphism, or animation.
-   Icon-only controls without labels.
-   Technical jargon.
-   Aggressive warning language.
-   Unnecessary screens, settings, or decorative widgets.

### 3.2 Design tokens

Use these initial tokens consistently:

``` css
:root {
  --color-primary: #173B35;
  --color-primary-action: #24594E;
  --color-mint: #EAF3EF;
  --color-mint-strong: #DCEDE5;
  --color-page: #F8FAF8;
  --color-surface: #FFFFFF;
  --color-text: #263330;
  --color-muted: #65736E;
  --color-border: #D5E0DC;
  --color-danger: #B54747;
  --color-warning-bg: #FFF4DF;
  --radius-card: 16px;
  --radius-control: 12px;
}
```

Use a consistent 8px spacing scale. Cards should generally use 12--16px
corner radii, subtle borders, and restrained shadows.

### 3.3 Typography

-   English: Inter, with a system sans-serif fallback.
-   Urdu: Noto Nastaliq Urdu or Noto Sans Arabic, whichever renders
    legibly in the target browser.
-   Body text should be comfortably readable. Do not use tiny text for
    essential instructions.
-   Use clear line height, especially for Urdu.

### 3.4 Bilingual and direction requirements

**The UI must show English and Urdu together** for primary navigation,
headings, important instructions, primary actions, and safety messages.

Examples:

-   Home / گھر
-   Learn & Practise / سیکھیں اور مشق کریں
-   Scam Detective / فراڈ کی پہچان
-   My Progress / میری کارکردگی
-   Start Learning / سیکھنا شروع کریں
-   Check Message / پیغام چیک کریں

Do not set the entire application to RTL.

For every Urdu text element, set `lang="ur"` and `dir="rtl"`. For
English, set `lang="en"` and `dir="ltr"`. Use a reusable bilingual text
component or equivalent. Ensure Urdu punctuation and mixed English terms
do not break layout.

Example:

``` jsx
<div className="bilingual-label">
  <span lang="en" dir="ltr">Start Learning</span>
  <span lang="ur" dir="rtl">سیکھنا شروع کریں</span>
</div>
```

Keep English and Urdu visually balanced. Do not make the Urdu line so
small that it becomes decorative or unreadable.

## 4. Global application layout

### Desktop: 1024px and wider

-   Left sidebar: approximately 230--250px.
-   Main content area fills remaining width.
-   Top header contains Sahaara brand and a short contextual greeting.
-   Main content max width: approximately 1100--1200px.
-   Use generous page padding.

### Tablet: 768px--1023px

-   Compact or collapsible sidebar.
-   Use two-column cards only when content remains readable.
-   Keep the lesson simulator prominent.

### Mobile: below 768px

-   No permanent desktop sidebar.
-   Use a compact top bar and bottom navigation.
-   Stack cards vertically.
-   Make controls easy to tap, ideally at least 48px high.
-   Simulator must fit the available width without horizontal page
    scrolling.
-   Keep the primary action easy to find.

### Navigation destinations

1.  Home / گھر
2.  Learn & Practise / سیکھیں اور مشق کریں
3.  Scam Detective / فراڈ کی پہچان
4.  My Progress / میری کارکردگی

The logo navigates to Home. Do not add login, profile, admin, or
settings screens.

## 5. Required screens and exact behaviour

### Screen A: Home dashboard

Build a dashboard with this hierarchy:

1.  **Header**
    -   Sahaara logo/name.
    -   Greeting: "Welcome to Sahaara" and Urdu equivalent.
    -   Optional welcome voice button. Do not autoplay speech.
2.  **Hero panel**
    -   English heading: "Technology, made easier"
    -   Urdu heading: "ٹیکنالوجی اب آسان"
    -   Short bilingual supporting sentence explaining that users can
        learn and practise safely.
3.  **Primary feature cards**
    -   Card 1: Learn & Practise / سیکھیں اور مشق کریں
        -   Friendly book/phone icon.
        -   Short explanation.
        -   CTA: Start Learning / سیکھنا شروع کریں
        -   Opens the lesson overview.
    -   Card 2: Scam Detective / فراڈ کی پہچان
        -   Shield icon.
        -   Short explanation.
        -   CTA: Check a Message / پیغام چیک کریں
        -   Opens Scam Detective.
4.  **Progress summary**
    -   Display completed lessons, e.g. `0 of 1 completed`.
    -   Read from localStorage.
    -   Clicking opens My Progress.
5.  **Reassurance note**
    -   "You can practise here without affecting your real phone."
    -   Urdu translation.

Desktop: feature cards side by side. Mobile: stacked cards.

### Screen B: Learn & Practise overview

-   Page title: Learn & Practise / سیکھیں اور مشق کریں.
-   One short bilingual explanation.
-   Show exactly one featured lesson for this MVP:
    -   Title: "How to make a WhatsApp video call"
    -   Urdu: "واٹس ایپ پر ویڈیو کال کیسے کریں"
    -   Level: Beginner / ابتدائی
    -   Duration: 2--3 minutes
    -   CTA: Start Lesson / سبق شروع کریں
-   Add a visible note that this is a simulated practice environment and
    does not connect to a real WhatsApp account.
-   Do not create multiple unfinished lesson cards.

### Screen C: Lesson practice and simulated phone

**This is the highest-priority screen. Spend the most frontend effort
here.**

Desktop layout: - Left column approximately 40%: instructions, step
counter, voice controls, feedback. - Right column approximately 60%:
simulated smartphone.

Mobile layout: - Instructions first. - Simulator below. - Keep the
current instruction and next action visible without excessive scrolling.

#### Lesson header

-   Back link to Learn & Practise.
-   Bilingual lesson title.
-   Step indicator, e.g. `Step 1 of 4`.
-   Simple progress bar.

#### Instruction panel

-   One short instruction at a time.
-   Urdu instruction should be prominent.
-   English translation should also be visible.
-   Add Play Urdu Voice, Pause/Resume, and Replay controls.
-   Do not autoplay voice.
-   Stop current speech when changing steps or leaving the lesson.

#### Simulated phone

Create a visual phone frame using HTML/CSS. It must be a **fictional,
non-connected simulator**, not a real WhatsApp integration.

The simulator should include: - A simple status bar. - A
WhatsApp-inspired header and chat screen. - Dummy contact such as
"Ayesha". - Fake sample chat messages. - Clearly labelled audio-call and
video-call controls. - A simulated connecting/call screen after the
correct action. - A way to return to chat or retry.

Use CSS and Lucide icons. Do not use screenshots of WhatsApp or copy its
complete branded interface. Make it clear that this is a practice
simulation.

#### Confidence Loop: implement these four states

1.  **SHOW_ME**
    -   Highlight the expected next control.
    -   Show a short bilingual instruction.
    -   User can click Continue / Try it.
2.  **LET_ME_TRY**
    -   Remove or reduce the highlight.
    -   Wait for the user to click the simulator control.
    -   Correct action advances.
    -   Incorrect action transitions to CORRECT_ME.
3.  **CORRECT_ME**
    -   Show a calm bilingual explanation.
    -   Example: "That starts an audio call. To see the other person,
        choose the video camera."
    -   Urdu: "اس سے آڈیو کال شروع ہوتی ہے۔ سامنے والے کو دیکھنے کے لیے
        ویڈیو کیمرہ منتخب کریں۔"
    -   Provide Try Again.
    -   Do not shame or blame the user.
4.  **INDEPENDENT_RETRY**
    -   Restart the task without hints.
    -   Let the user complete the action independently.
    -   On success, show completion feedback and mark the lesson
        complete.

Expected demo interaction: - The user is asked to start a video call. -
Clicking the audio-call control shows a correction. - Clicking the
video-call control advances to a simulated video-call screen. - The user
can retry independently. - On final success, show: - "You did it!" / "آپ
نے کر لیا!" - "You completed your first practice." / "آپ نے اپنی پہلی
مشق مکمل کر لی۔" - Button: Finish / مکمل کریں - Button: Practise Again /
دوبارہ مشق کریں

Keep the state logic explicit and predictable. Do not implement the
lesson as a set of unrelated static screens.

### Screen D: Scam Detective

Build a single-page message checking experience.

#### Header and introduction

-   Title: Scam Detective / فراڈ کی پہچان.
-   Shield icon.
-   Bilingual intro: "Paste a suspicious SMS or message below. We'll
    point out warning signs."

#### Input

-   Large multiline textarea.

-   Placeholder should show a harmless example, not ask for real private
    details.

-   Primary CTA: Check Message / پیغام چیک کریں.

-   Validate empty input.

-   Show a prominent bilingual warning:

    "Never enter an OTP, PIN, password, card number, or banking login
    details."

    "اپنا او ٹی پی، پن، پاس ورڈ، کارڈ نمبر یا بینک لاگ اِن کی معلومات
    یہاں درج نہ کریں۔"

-   Do not store submitted message text in localStorage.

#### Loading state

-   Disable submit while request is running.
-   Show clear bilingual loading text.
-   Prevent duplicate submissions.

#### Results panel

Render: - Risk level: Low / Medium / High with text labels, not colour
alone. - Short English and Urdu summary. - Warning indicators as a
bilingual bullet list. - Safe next steps as a bilingual numbered list. -
A clear disclaimer: the tool provides guidance, not a guarantee that a
message is safe or fraudulent.

#### Error and fallback

-   If the API is unavailable, show a friendly bilingual error.
-   Add a local fallback for obvious patterns such as:
    -   Requests for OTP, PIN, password, or banking credentials.
    -   Urgent threats such as "account will be blocked today".
    -   Suspicious shortened or unfamiliar links.
    -   Messages pretending to be a bank or government service.
-   Fallback must be cautious. Do not label an unknown message "safe".
-   Never encourage the user to open a suspicious link.

Use a fake sample message for the demo:

> Your bank account will be blocked today. Send your OTP now to verify.

### Screen E: My Progress

-   Page title: My Progress / میری کارکردگی.
-   Show lessons completed, e.g. `1 of 1`.
-   Show a simple progress bar.
-   Show one lesson row:
    -   WhatsApp video call.
    -   Status: Not started / In progress / Completed.
    -   Action: Continue or Practise Again.
-   Persist only the lesson completion state in localStorage.
-   Provide a friendly empty state:
    -   "Your learning journey starts here."
    -   "آپ کا سیکھنے کا سفر یہاں سے شروع ہوتا ہے۔"

## 6. Urdu voice implementation

Use browser `window.speechSynthesis` for optional voice guidance.

Requirements: - Speak the Urdu instruction text, not the English
translation. - Find an available Urdu voice by checking
`speechSynthesis.getVoices()` and voice language tags where possible. -
Account for asynchronous voice loading via `voiceschanged`. - Provide
Play, Pause/Resume, Replay, and Stop behaviour. - Stop speech on route
change, step change, and component unmount. - Do not autoplay. - If no
suitable Urdu voice is available, keep Urdu text visible and show a
message that voice is unavailable on this device. - Do not silently use
a clearly unsuitable voice for Urdu. - Test on the exact browser/device
planned for the demo.

Do not call a paid TTS API from the frontend.

## 7. Frontend component structure

Create reusable components. Suggested structure:

``` text
src/
  components/
    AppShell.jsx
    Sidebar.jsx
    MobileNav.jsx
    BilingualText.jsx
    FeatureCard.jsx
    ProgressCard.jsx
    VoiceControls.jsx
    FeedbackMessage.jsx
  components/
    simulator/
      PhoneSimulator.jsx
      WhatsAppChat.jsx
      VideoCallScreen.jsx
  pages/
    Dashboard.jsx
    Learn.jsx
    LessonPractice.jsx
    ScamDetective.jsx
    MyProgress.jsx
  data/
    lessonData.js
    sampleMessages.js
  hooks/
    useSpeech.js
    useProgress.js
  services/
    api.js
  styles/
    index.css
  App.jsx
  main.jsx
```

You may adjust the structure to match the existing repository, but keep
UI components reusable and screen logic separated.

## 8. Data and state requirements

### Lesson data

Keep static lesson content in `src/data/lessonData.js`. Each step should
include: - Stable step ID. - English instruction. - Urdu instruction. -
Expected simulator action. - Optional correction text in English and
Urdu.

Do not create a backend endpoint for static lesson steps.

### Progress

Use localStorage with a small, versioned key such as:

``` js
const PROGRESS_KEY = "sahaara_progress_v1";
```

Store only: - Lesson ID. - Status. - Completion boolean or timestamp.

Do not store message checker input or sensitive user information.

### API service

Create one service module for backend requests. Read the base URL from
`VITE_API_BASE_URL`. Add timeout/error handling if feasible. Keep mock
data available as a development fallback.

## 9. Backend integration contract

Coordinate with the backend developer and agree on this endpoint.

`POST /api/scam/analyze`

Request:

``` json
{
  "message": "Your bank account will be blocked. Send your OTP."
}
```

Response:

``` json
{
  "risk_level": "high",
  "summary_en": "This message has several warning signs.",
  "summary_ur": "اس پیغام میں خطرے کی کئی نشانیاں موجود ہیں۔",
  "indicators": [
    {
      "en": "It asks for an OTP.",
      "ur": "یہ آپ سے او ٹی پی مانگ رہا ہے۔"
    }
  ],
  "safe_steps": [
    {
      "en": "Do not share your OTP.",
      "ur": "اپنا او ٹی پی کسی کو نہ دیں۔"
    }
  ],
  "disclaimer_en": "This is guidance, not a guarantee.",
  "disclaimer_ur": "یہ رہنمائی ہے، حتمی ضمانت نہیں۔"
}
```

Frontend rules: - Accept only known risk levels: `low`, `medium`,
`high`, otherwise use `unknown`. - Handle missing fields safely. -
Render text as text, never inject model output as HTML. - Do not display
raw stack traces or backend errors to users. - Do not expose API keys. -
Do not block the rest of the app if the API is offline.

## 10. Accessibility and usability requirements

-   Use semantic buttons, links, labels, headings, and form controls.
-   Every textarea has an accessible label.
-   Keyboard users can reach all interactive controls.
-   Provide visible focus states.
-   Do not rely on colour alone to communicate risk or success.
-   Keep button labels explicit.
-   Ensure Urdu and English remain readable at mobile widths.
-   Avoid horizontal overflow.
-   Provide clear loading, empty, success, and error states.
-   Do not auto-play voice or animation.
-   Use patient, encouraging language in all correction messages.

## 11. Six-hour implementation schedule

  -----------------------------------------------------------------------
  Time                    Frontend task           Required outcome
  ----------------------- ----------------------- -----------------------
  0:00--0:30              Inspect repo, setup     App runs
                          React/Vite, Tailwind,   
                          fonts, design tokens,   
                          app shell               

  0:30--1:15              Dashboard, navigation,  Home and Learn screens
                          lesson overview         work

  1:15--2:45              Phone frame, fake chat, Simulator works
                          call controls,          
                          simulated call screen   

  2:45--3:30              Confidence Loop states, Main demo flow complete
                          correction, independent 
                          retry                   

  3:30--4:30              Scam Detective UI with  Scam screen works
                          mock response, loading  locally
                          and errors              

  4:30--5:15              Backend integration,    End-to-end frontend
                          Urdu voice controls,    
                          LocalStorage progress   

  5:15--6:00              Mobile responsiveness,  Stable demo build
                          accessibility, bug      
                          fixes, demo rehearsal   
  -----------------------------------------------------------------------

**Integration rule:** use mock data immediately. Do not wait for the
backend. Agree on the API contract early and integrate by approximately
hour four.

## 12. Acceptance checklist

Do not call the frontend complete until all P0 checks pass:

-   [ ] App starts using the documented command.
-   [ ] Dashboard is bilingual and responsive.
-   [ ] All navigation destinations work.
-   [ ] Learn screen opens the WhatsApp video-call lesson.
-   [ ] Simulated phone controls respond to clicks.
-   [ ] Wrong audio-call action shows a helpful correction.
-   [ ] Correct video-call action advances to the simulated call screen.
-   [ ] Independent retry works without hints.
-   [ ] Successful completion updates progress.
-   [ ] Progress persists after refresh.
-   [ ] Scam Detective validates empty input.
-   [ ] Scam Detective shows loading and results states.
-   [ ] Scam Detective handles API failure with a safe fallback.
-   [ ] Scam UI never asks for or stores OTP, PIN, password, or banking
    credentials.
-   [ ] Urdu and English text render with correct direction.
-   [ ] Urdu voice works when a suitable device voice is available;
    otherwise a clear fallback is shown.
-   [ ] Mobile layout has no horizontal overflow.
-   [ ] No dead buttons or placeholder links remain in the demo path.

## 13. Strict scope limits

Do **not** build these for the six-hour MVP:

-   Authentication or user accounts.
-   Profile or settings screens.
-   Admin dashboard.
-   Real WhatsApp integration.
-   Real phone calls or messages.
-   Real banking integrations.
-   Database.
-   Multiple unfinished tutorials.
-   Generated video demonstrations.
-   Complex animation systems.
-   A full language settings framework.
-   Any feature that delays the two core experiences.

## 14. Final build instruction to the coding agent

Implement the application, not just a mockup or static design. Every
visible primary action in the demo path must work. Prioritise the
simulated WhatsApp lesson and Confidence Loop, then Scam Detective, then
dashboard and progress polish.

Use mock data until backend integration is available. Keep the code
readable and componentised. Run the app, test the full demo flow, fix
console errors and responsive issues, and leave clear instructions for
starting the frontend.

**Definition of success:** A first-time user can understand the
bilingual dashboard, practise making a WhatsApp video call in a safe
simulation, recover from a wrong choice without embarrassment, complete
the task independently, check a suspicious sample message, and see their
progress.
