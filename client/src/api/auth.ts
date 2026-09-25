import { apiClient } from './axios'
import type { LoginResponse, Usuario } from '../types/api'

export interface LoginRequest {
    usuario: string
    contrasena: string
}

export interface UsuarioResponse {
    ok: true
    usuario: Usuario
}

export async function iniciarSesion(datos: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', datos)
    return data
}

export async function obtenerUsuarioActual(): Promise<UsuarioResponse> {
    const { data } = await apiClient.get<UsuarioResponse>('/auth/me')
    return data
}