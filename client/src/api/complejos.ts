import { apiClient } from './axios'
import type { Complejo, ComplejosResponse } from '../types/api'

export interface CrearComplejoRequest {
    nombre: string
}

export type ActualizarComplejoRequest = CrearComplejoRequest

export interface ComplejoResponse {
    ok: true
    complejo: Complejo
}

export interface RelacionUsuarioResponse {
    ok: true
    relacion: unknown
}

export async function obtenerComplejos(): Promise<ComplejosResponse> {
    const { data } = await apiClient.get<ComplejosResponse>('/complejos')
    return data
}

export async function obtenerComplejo(id: number): Promise<ComplejoResponse> {
    const { data } = await apiClient.get<ComplejoResponse>(`/complejos/${id}`)
    return data
}

export async function crearComplejo(datos: CrearComplejoRequest): Promise<ComplejoResponse> {
    const { data } = await apiClient.post<ComplejoResponse>('/complejos', datos)
    return data
}

export async function actualizarComplejo(id: number, datos: ActualizarComplejoRequest): Promise<ComplejoResponse> {
    const { data } = await apiClient.put<ComplejoResponse>(`/complejos/${id}`, datos)
    return data
}

export async function eliminarComplejo(id: number): Promise<ComplejoResponse> {
    const { data } = await apiClient.delete<ComplejoResponse>(`/complejos/${id}`)
    return data
}

export async function habilitarUsuario(complejoId: number, usuarioId: number): Promise<RelacionUsuarioResponse> {
    const { data } = await apiClient.patch<RelacionUsuarioResponse>(
        `/complejos/${complejoId}/usuarios/${usuarioId}/habilitar`,
    )
    return data
}

export async function inhabilitarUsuario(complejoId: number, usuarioId: number): Promise<RelacionUsuarioResponse> {
    const { data } = await apiClient.patch<RelacionUsuarioResponse>(
        `/complejos/${complejoId}/usuarios/${usuarioId}/inhabilitar`,
    )
    return data
}