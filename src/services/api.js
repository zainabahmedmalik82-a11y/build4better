const BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:8000'

export class ApiError extends Error {
  constructor(type, message, status = null) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.status = status
  }
}

export async function analyzeMessage(message) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 35000)

  try {
    const res = await fetch(`${BASE}/api/scam/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    })

    if (!res.ok) {
      if (res.status === 422) {
        throw new ApiError('422', 'Validation error', 422)
      }
      if (res.status === 500) {
        throw new ApiError('500', 'Internal server error', 500)
      }
      throw new ApiError('unknown', `Request failed with status ${res.status}`, res.status)
    }

    const data = await res.json()
    return data
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    if (err.name === 'AbortError') {
      throw new ApiError('timeout', 'Request timed out after 35 seconds')
    }
    throw new ApiError('network', 'Failed to connect to backend server')
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function solveProblem(problem) {
  return { success: true, problem }
}