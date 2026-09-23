export interface ApiErrorResponse {
  ok: false
  code: string
  message: string
}

export interface HealthResponse {
  ok: boolean
  message: string
}

export interface Usuario {
  id: number
  nombre: string
  usuario: string
}

export interface LoginResponse {
  ok: true
  token: string
  usuario: Usuario
}

export interface Complejo {
  id: number
  nombre: string
  eliminado: boolean
  fechaCreacion: string
  usuarioCreadorId: number
}

export interface ComplejosResponse {
  ok: true
  complejos: Complejo[]
}