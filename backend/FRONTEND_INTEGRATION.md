# Frontend Integration Guide for Sahaara Backend

This guide outlines the exact integration requirements and best practices for connecting the Sahaara React/Vite frontend to the FastAPI backend service.

---

## 1. Environment Configuration

In the frontend root directory (or in `.env` / `.env.local`):

```env
# URL where the Sahaara FastAPI service is listening
VITE_API_BASE_URL=http://localhost:8000
```

When building for production, set `VITE_API_BASE_URL` to your production backend domain.

---

## 2. API Endpoints

### 2.1 Health Check Probe
- **Method**: `GET`
- **URL**: `${VITE_API_BASE_URL}/api/health`
- **Expected Status**: `200 OK`
- **Response Shape**:
  ```json
  {
    "status": "healthy",
    "service": "Sahaara Backend"
  }
  ```
- **Usage**: Use on app startup or in a connectivity check banner to alert the user if the backend is unreachable.

---

### 2.2 Scam Message Analysis
- **Method**: `POST`
- **URL**: `${VITE_API_BASE_URL}/api/scam/analyze`
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "message": "User-entered or pasted SMS text here"
  }
  ```

#### Request Validation Constraints:
- `message` must be a non-empty string (leading/trailing whitespace is stripped).
- Maximum allowed length is **5,000 characters**.
- If violated, the backend responds with `422 Unprocessable Content`.

---

## 3. Response Contract & UI Mapping

### Complete Response Structure
```typescript
interface Indicator {
  en: string;
  ur: string;
}

interface ScamAnalyzeResponse {
  risk_level: "high" | "medium" | "low" | "unknown";
  summary_en: string;
  summary_ur: string;
  indicators: Indicator[];
  safe_steps: string[];
  disclaimer_en: string;
  disclaimer_ur: string;
  analysis_source: "ai" | "fallback";
}
```

### UI Presentation Rules

1. **Risk Level Badges & Colors**:
   - `"high"`: Red badge (`#EF4444` / `bg-red-100 text-red-800`). Indicates urgent threat (OTP, banking theft, card fraud).
   - `"medium"`: Orange/Amber badge (`#F59E0B` / `bg-amber-100 text-amber-800`). Indicates pressure language or unverified links.
   - `"unknown"`: Gray/Slate badge (`#64748B` / `bg-slate-100 text-slate-800`). Inconclusive result.
   - `"low"`: Blue/Teal badge (`#0D9488` / `bg-teal-100 text-teal-800`). Low suspicion.
   - ⚠️ **CRITICAL DESIGN RULE**: **"Low" is NOT "Safe"**. Do **NOT** display green checkmarks with text like "Safe Message" or "No Scam". Always label it as "Low Risk" and keep the disclaimer visible.

2. **Fallback Indicator (`analysis_source: "fallback"`)**:
   - When `analysis_source === "fallback"`, the AI service was offline, rate-limited, or unavailable.
   - The backend fell back to deterministic heuristic scanning.
   - **Display a subtle notification banner** in the UI:
     - *English*: "AI analysis is currently unavailable. Displaying automated security check results."
     - *Urdu*: "اے آئی تجزیہ اس وقت دستیاب نہیں ہے۔ خودکار سیکیورٹی نتائج دکھائے جا رہے ہیں۔"

3. **Bilingual Display**:
   - Sahaara is a bilingual application. Render both English and Urdu summaries and indicators cleanly.
   - Apply `dir="rtl"` and an Urdu-compatible font (such as *Noto Nastaliq Urdu* or *Jameel Noori Nastaleeq*) to `summary_ur`, `disclaimer_ur`, and `indicator.ur`.

4. **Actionable Safe Steps**:
   - Render `safe_steps` as an ordered checklist with prominent action buttons (e.g., "Call Official Bank Helpline", "Block Sender").

---

## 4. Network & Error Handling

### 4.1 Recommended Timeout
- The backend allows up to **30 seconds** for Groq reasoning completions.
- The frontend `fetch` / `axios` client **must set a minimum timeout of 35 seconds** before aborting, preventing premature client-side disconnects:
  ```javascript
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(`${VITE_API_BASE_URL}/api/scam/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
  ```

### 4.2 Error Scenarios to Handle

| HTTP Status | Meaning | Recommended Frontend Action |
|---|---|---|
| **`422`** | Validation Error (e.g. empty message or >5000 chars) | Show field validation message: "Please provide a message under 5000 characters." |
| **`500`** | Internal Server Error | Show friendly error: "Unable to complete security analysis. Please try again later." |
| **Network Error / Failed to fetch** | Backend server is not running or blocked by CORS | Show offline banner: "Cannot connect to Sahaara security service. Ensure backend is running." |

---

## 5. Privacy & Security Constraints

1. **Zero Client-Side Persistence of Untrusted Content**:
   - **Never store** submitted messages, OTPs, or financial credentials in `localStorage`, `sessionStorage`, or IndexedDB.
   - Do **not** send submitted message text to Google Analytics, Mixpanel, or third-party error trackers (e.g., Sentry event payloads).
2. **Clear on Reset**:
   - Provide a "Clear / Scan Another Message" button that resets input state and clears memory.
