# Sahaara Backend API

> **"Your Personal Digital Confidence Coach"** — Scam detection, digital safety analysis, and confidence building for everyday users in Pakistan.

FastAPI backend service integrating deterministic security heuristics and Groq LLM intelligence to evaluate suspicious SMS and chat messages in English and Urdu.

---

## 1. Setup & Installation

### Requirements
- **Python**: 3.10+ (tested on Python 3.10.11)
- **Virtual Environment**: `.venv` recommended

### Installation Steps
```bash
# Navigate to the backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Windows (CMD):
.\.venv\Scripts\activate.bat
# Linux / macOS:
source .venv/bin/activate

# Install pinned dependencies
pip install -r requirements.txt
```

---

## 2. Environment Configuration

1. Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   # Application Title
   APP_NAME=Sahaara Backend

   # Groq API Key (obtain from https://console.groq.com)
   # NEVER commit real keys to Git. backend/.env is strictly gitignored.
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here

   # Recommended Groq model for speed & reasoning
   GROQ_MODEL=openai/gpt-oss-120b

   # Allowed CORS origins (comma-separated; no wildcard "*")
   ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

   # Maximum input length for scam analysis (characters)
   MAX_MESSAGE_LENGTH=5000

   # Client timeout & reasoning options
   GROQ_TIMEOUT_SECONDS=30.0
   GROQ_MAX_TOKENS=2048
   GROQ_REASONING_EFFORT=low
   ```

> **Security Note**: Never commit `backend/.env` or any secret keys. Keep `.env.example` populated with placeholders only.

---

## 3. Running the Service

Start the local Uvicorn development server:
```bash
uvicorn app.main:app --reload --port 8000
```

- **Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI Schema**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 4. Running Tests

Run the full automated pytest suite (59 unit & integration tests):
```bash
# Run all tests with verbose output
python -m pytest tests -v

# Run with an explicitly empty API key (verifies mock isolation)
pytest tests -v
```

All Groq API calls in test cases are completely mocked — tests run deterministically with zero network calls and no real API key required.

---

## 5. API Contract & Endpoints

### 5.1 Health Check
- **Endpoint**: `GET /api/health`
- **Purpose**: Service liveness and health probe.
- **Response**: `200 OK`
  ```json
  {
    "status": "healthy",
    "service": "Sahaara Backend"
  }
  ```

---

### 5.2 Analyze Suspicious Message
- **Endpoint**: `POST /api/scam/analyze`
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "message": "Your bank account has been suspended. Please send your OTP immediately to verify."
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `message` | string | Yes | 1 to 5000 characters. Stripped of leading/trailing whitespace. Empty or whitespace-only strings rejected. |

#### Response Payload (AI Success - `analysis_source: "ai"`)
```json
{
  "risk_level": "high",
  "summary_en": "The message claims your bank account is suspended and asks for an OTP, which is a common phishing tactic.",
  "summary_ur": "یہ پیغام دعویٰ کرتا ہے کہ آپ کا بینک اکاؤنٹ معطل ہے اور فوری طور پر OTP بھیجنے کو کہتا ہے، جو عام فشنگ دھوکہ دہی کا طریقہ ہے۔",
  "indicators": [
    {
      "en": "The message requests a one-time password (OTP) or verification code.",
      "ur": "یہ پیغام ون ٹائم پاس ورڈ (OTP) یا تصدیقی کوڈ مانگ رہا ہے۔"
    },
    {
      "en": "The message requests sensitive banking details or bank account access.",
      "ur": "یہ پیغام حساس بینک اکاؤنٹ یا بینکنگ تفصیلات طلب کر رہا ہے۔"
    },
    {
      "en": "The message creates artificial urgency or threatens imminent account suspension.",
      "ur": "یہ پیغام جلدی کرنے کا دباؤ ڈال رہا ہے یا اکاؤنٹ معطلی کی دھمکی دے رہا ہے۔"
    }
  ],
  "safe_steps": [
    "Do not share OTPs, PINs, passwords, or banking credentials with anyone.",
    "Do not click on links or call phone numbers provided in suspicious messages.",
    "Verify the sender independently through official contact channels or official customer care."
  ],
  "disclaimer_en": "This analysis is guidance, not a guarantee.",
  "disclaimer_ur": "یہ تجزیہ صرف رہنمائی ہے، مکمل ضمانت نہیں۔",
  "analysis_source": "ai"
}
```

#### Response Payload (Fallback Mode - `analysis_source: "fallback"`)
Returned automatically when Groq is unreachable, times out, is rate-limited, or lacks an API key:
```json
{
  "risk_level": "high",
  "summary_en": "AI analysis is temporarily unavailable. Automated security checks detected critical warning signs (such as requests for OTP, PIN, password, or financial credentials) in this message.",
  "summary_ur": "اے آئی تجزیہ عارضی طور پر دستیاب نہیں ہے۔ خودکار سیکیورٹی چیکس نے اس پیغام میں شدید خطرے کی انتباہی نشانیاں (جیسے ون ٹائم پاس ورڈ، پن، پاس ورڈ یا مالی تفصیلات کی طلب) شناخت کی ہیں۔",
  "indicators": [
    {
      "en": "The message requests a one-time password (OTP) or verification code.",
      "ur": "یہ پیغام ون ٹائم پاس ورڈ (OTP) یا تصدیقی کوڈ مانگ رہا ہے۔"
    }
  ],
  "safe_steps": [
    "Do not share OTPs, PINs, passwords, or banking credentials with anyone.",
    "Do not click on links or call phone numbers provided in suspicious messages.",
    "Verify the sender independently through official contact channels or official customer care."
  ],
  "disclaimer_en": "This analysis is guidance, not a guarantee.",
  "disclaimer_ur": "یہ تجزیہ صرف رہنمائی ہے، مکمل ضمانت نہیں۔",
  "analysis_source": "fallback"
}
```

#### Risk Levels
- `"high"`: Critical risk signals detected (OTP, PIN, password, banking, card details).
- `"medium"`: Suspicious patterns detected (urgency pressure, shortened/suspicious URLs).
- `"unknown"`: Inconclusive; automated checks found no specific signals.
- `"low"`: Lowest risk assessment. **Allowed only when AI analysis succeeds.** Fallback mode **never** returns `"low"` or `"safe"`.

---

## 6. Safety & Architecture Rules

1. **Deterministic Risk Floor**: Deterministic heuristics execute first. If heuristic flags detect high risk (e.g., OTP or PIN requests), the final risk level **cannot be lowered** by the AI model.
2. **"Low" Does Not Mean "Safe"**: The system never issues a "guaranteed safe" certification. All responses include prominent English and Urdu disclaimers.
3. **Privacy First — Zero Content Logging**: User message text, credentials, phone numbers, and raw AI completions are **never printed to stdout or logged to files**. Only metadata (request status, exception type) is logged.
4. **Input Sanitization on 422**: When validation fails, submitted text is not echoed back in error responses to prevent reflection of sensitive information.

---

## 7. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **CORS Error in Browser** | Origin not in `ALLOWED_ORIGINS` | Ensure frontend host (e.g. `http://localhost:5173`) is listed in `backend/.env` under `ALLOWED_ORIGINS`. Wildcards (`*`) are disallowed by design. |
| **`analysis_source: "fallback"` returned** | `GROQ_API_KEY` missing, expired, or rate-limited | Check `backend/.env` to confirm a valid Groq API key is present. Backend gracefully degrades to deterministic safety checks instead of crashing. |
| **Port 8000 already in use** | Another process is bound to port 8000 | Run on a different port: `uvicorn app.main:app --reload --port 8001`, and update the frontend's API URL configuration. |
| **422 Unprocessable Content** | Empty message, missing field, or message > 5000 chars | Verify that request payload is valid JSON: `{"message": "non-empty string"}` under 5000 characters. |
