export interface ApiErrorResponse {
  ok: false
  code: string
  message: string
}

export interface HealthResponse {
  ok: boolean
  message: string
}