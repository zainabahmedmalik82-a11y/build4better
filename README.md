# Sahaara (سہارا)

> **"Your Personal Digital Confidence Coach"**<br/>
> *Learn technology. Practise safely. Use it confidently.*

---

## Demo

- Demo video: <add link>
- Screenshots: <add>

---

## The Problem Sahaara Solves

For millions of adults, older generations, and non-English speakers in Pakistan, everyday digital technology feels intimidating and perilous. Fear of making irreversible mistakes—or falling victim to aggressive SMS scams, fake bank alerts, lottery fraud, and credential theft—creates digital exclusion and anxiety.

**Sahaara** is a calm, accessible digital confidence coach. It transforms digital hesitation into confidence by offering a safe sandbox to practice phone tasks without fear of real-world consequences, combined with an intelligent Scam Detective that analyzes suspicious messages in plain English and natural Urdu.

---

## MVP Features

### 1. Learn & Practise with the Confidence Loop
- **AI-Powered Practice Lessons**: The user describes a smartphone problem or question in plain text. The backend endpoint `POST /api/learn/generate` asks the AI to construct an interactive, step-by-step practice lesson (max 5 steps).
- **Generic Simulated Phone**: Lessons run inside a realistic, interactive simulated phone sandbox featuring standard app, chat, home, and form interfaces.
- **Resilient Fallback**: If the AI generator is unavailable or times out, a sample WhatsApp video call tutorial is automatically provided (source `"preset"`).
- **Safe Simulated Data**: Lessons use simulated placeholder data and never ask for real PINs, OTPs, passwords, or credit card numbers.
- **The Confidence Loop Pedagogy**:
  1. *Show Me*: Demonstrates the correct action in simple language and highlights the button.
  2. *Let Me Try*: The learner interacts with the simulated phone in guided practice.
  3. *Correct Me*: Gentle, non-shaming correction if an incorrect tap is made (e.g. *"That starts an audio call. To see the other person, choose the video camera"*), with a friendly Try Again retry.
  4. *Let Me Do It Myself*: The learner retries independently without hints or highlights to reinforce confidence.
- **Guided Urdu Voice**: Spoken instructions and feedback powered by browser `SpeechSynthesis` (Microsoft Edge recommended). Speech triggers only after the first user gesture (tapping "Let Me Try"), never unexpectedly on page load. All text remains clearly visible on screen.
- **Privacy-Preserving Progress**: Progress tracking stores only completed lesson titles and completion dates in the browser (`localStorage`), never the user's problem text.

### 2. Scam Detective
- **Dual-Engine Scam Analysis**: Combines deterministic security rules with Groq LLM intelligence to evaluate suspicious SMS and WhatsApp messages.
- **Clear Risk Badges**:
  - `High Risk`: Dangerous requests for OTPs, PINs, banking credentials, or passwords.
  - `Medium Risk`: Urgency pressure language or unverified links.
  - `Low Risk`: Everyday conversational messages with no detected indicators.
  - `Unknown`: Inconclusive messages where caution is advised.
- **Bilingual Results**: Plain-language summaries and indicators in both English and Urdu.
- **Safe Next Steps**: Clear, actionable recommendations (e.g. "Call your official bank branch helpline", "Do not share verification codes").

---

## Bilingual First (English + اردو)

Sahaara is designed from the ground up for linguistic accessibility:
- **Parallel UI**: Key titles, summaries, instructions, and error banners are presented side-by-side in English and Urdu.
- **RTL Typography**: Optimized right-to-left layout and readable typography for Urdu script.
- **Voice Playback**: One-click voice button to listen to lesson prompts and safety instructions aloud in natural Urdu.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React icons, Web Speech API (`SpeechSynthesis`) |
| **Backend** | Python 3.10+, FastAPI, Pydantic v2, Groq Python SDK (`groq`), Uvicorn, python-dotenv |
| **AI Engine** | Groq API (model configurable via `GROQ_MODEL` in `.env`, default `openai/gpt-oss-120b`) |
| **Testing** | Pytest, HTTPX, FastAPI TestClient (75 automated test cases) |

---

## Core Safety Principles

1. **"Low" Does Not Mean "Safe"**: The system never certifies any message as "guaranteed safe." All responses carry clear English and Urdu guidance disclaimers.
2. **Deterministic Risk Floor**: Deterministic heuristic rules always execute first. If a rule detects a credential theft attempt (such as an OTP or PIN request), **the AI model cannot lower the risk level**, preventing prompt injection bypasses.
3. **Zero Content Logging & Privacy First**: Submitted messages and practice problem descriptions are not stored on disk, not logged, and not saved in browser storage.
4. **Resilient Safe Fallback**: If the Groq AI service is offline, times out, or lacks an API key, the system automatically falls back to deterministic heuristic scanning for scams and preset lessons for learning. It never crashes or leaves the user without guidance.

---

## Project Structure

```text
Build4Better Hackathon/
├── backend/                        # FastAPI Python backend service
│   ├── app/
│   │   ├── core/config.py          # Environment settings (CORS, timeouts, models)
│   │   ├── schemas/
│   │   │   ├── lesson.py           # Pydantic v2 schemas for AI lesson generation
│   │   │   └── scam.py             # Pydantic v2 schemas for scam analysis
│   │   ├── services/
│   │   │   ├── groq_service.py     # Groq LLM integration with JSON mode
│   │   │   ├── lesson_service.py   # AI lesson generation & preset fallback
│   │   │   └── scam_service.py     # Scam coordination & heuristic fallback
│   │   ├── utils/safety.py         # Deterministic safety heuristics (OTP, links, Urdu)
│   │   └── main.py                 # FastAPI application, CORS & error handlers
│   ├── tests/                      # Automated test suite (75 pytest unit/integration tests)
│   ├── .env.example                # Backend configuration template
│   ├── requirements.txt            # Pinned Python dependencies
│   ├── README.md                   # Detailed backend technical docs
│   └── FRONTEND_INTEGRATION.md     # Frontend API contract & UI specifications
├── docs/                           # Project specifications & architecture docs
├── public/                         # Static assets, SVG icons & favicons
├── src/                            # React frontend application
│   ├── components/                 # PhoneSimulator, BilingualText, VoiceControls, AppShell
│   ├── data/lessonData.js          # Preset Confidence Loop lesson content
│   ├── hooks/                      # useProgress, useSpeech
│   ├── pages/                      # Dashboard, Learn, LessonPractice, ScamDetective, MyProgress
│   ├── services/api.js             # Frontend API client with 35s timeout & error handling
│   ├── App.jsx                     # Top-level state navigation
│   └── main.jsx                    # React application entry point
├── .env.example                    # Root frontend environment template
├── package.json                    # Frontend dependencies & Vite scripts
└── README.md                       # Main project documentation (this file)
```

---

## Quick Start & Running Locally

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node.js 24)
- **Python**: 3.10+ (tested on Python 3.10.11)
- **Groq API Key**: Free API key from [Groq Console](https://console.groq.com)

---

### 2. Backend Setup (Terminal 1)

```bash
# Navigate to the backend folder
cd backend

# Create and activate Python virtual environment
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux / macOS:
source .venv/bin/activate

# Install pinned dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit backend/.env and add your GROQ_API_KEY:
# GROQ_API_KEY=gsk_your_key_here

# Start the FastAPI server on port 8000
uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- Interactive Swagger Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### 3. Frontend Setup (Terminal 2)

```bash
# Navigate to project root (in a separate terminal)
cd <project root>

# Configure frontend environment
cp .env.example .env
# (Ensures VITE_API_BASE_URL=http://localhost:8000)

# Install npm dependencies
npm install

# Start the Vite development server on port 5173
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Running Automated Tests

Run the full backend test suite with 75 automated test cases covering safety checks, schema validation, AI lesson generation, Groq mocking, and fallback behavior:

```bash
cd backend
python -m pytest tests -v
```

All API tests run with completely mocked AI calls, verifying 100% deterministic test execution with zero network dependency.

To test the production frontend build:
```bash
npm run build
```

---

## Demo Guide: Try Scam Detective

You can test the Scam Detective with these sample messages:

### 1. Urgent OTP Scam Message
> *"Your bank account has been suspended due to suspicious activity. Send your OTP code immediately to verify your identity."*
- **Result**: `High Risk`
- **Detected Flags**: OTP request, banking details request, artificial urgency.
- **Advice**: Never share OTP codes via SMS; contact your bank via official helpline numbers.

### 2. Everyday Harmless Message
> *"Assalam o Alaikum, are you free for lunch tomorrow at 1pm?"*
- **Result**: `Low Risk`
- **Notice**: Disclaimers remind the user that low risk is not an absolute guarantee of safety.

### 3. Unverified Link / Prize Scam
> *"Congratulations! You have won Rs. 50,000 cash prize in our lucky draw. Click here to claim your reward: http://bit.ly/claim-prize"*
- **Result**: `Medium Risk`
- **Detected Flags**: Unverified shortened link, lottery/prize bait.
- **Advice**: Avoid clicking unknown links; verify through official brand channels.

---

## Known Limitations

- **Input Modalities**: Voice and screenshot problem input are not implemented yet.
- **Urdu Voice Availability**: Guided Urdu speech synthesis availability varies depending on the operating system and browser installed voices (Microsoft Edge provides the best out-of-the-box Urdu voice support).
- **LLM Quota**: Groq Cloud free-tier rate limits apply when generating high volumes of lessons or scam scans (the service automatically degrades to heuristic and preset fallbacks if quota is exceeded).

---

## Future Vision

1. **Voice and Screenshot Problem Input**: Allow users to describe problems by speaking aloud or uploading screenshots.
2. **More Tutorials**: Additional interactive tutorials for everyday essential tasks (e.g. banking apps, bill payment, utility apps).
3. **AI Helper**: An AI helper that takes a user's problem and guides them step by step through any app.
4. **More Local-Language Support**: Expanding voice and interface support to additional regional Pakistani languages.
