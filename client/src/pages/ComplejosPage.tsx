import { useEffect, useState } from 'react'
import axios from 'axios'
import { apiClient } from '../api/client'
import type { ApiErrorResponse, Complejo, ComplejosResponse } from '../types/api'
import './ComplejosPage.css'

export function ComplejosPage() {
    const [complejos, setComplejos] = useState<Complejo[]>([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function cargarComplejos() {
            try {
                const { data } = await apiClient.get<ComplejosResponse>('/complejos')
                setComplejos(data.complejos)
            } catch (requestError) {
                if (axios.isAxiosError<ApiErrorResponse>(requestError)) {
                    setError(requestError.response?.data.message ?? 'No se pudieron cargar los complejos.')
                } else {
                    setError('No se pudieron cargar los complejos.')
                }
            } finally {
                setCargando(false)
            }
        }

        void cargarComplejos()
    }, [])

    return (
        <section className="complexes-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Administración</p>
                    <h1>Complejos</h1>
                    <p className="page-description">Consulta los complejos asociados a tu cuenta.</p>
                </div>
                <span className="count-badge">{complejos.length} {complejos.length === 1 ? 'complejo' : 'complejos'}</span>
            </div>
            {cargando && <p className="status-message">Cargando complejos...</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            {!cargando && !error && complejos.length === 0 && (
                <div className="empty-state">
                    <h2>Aún no tienes complejos</h2>
                    <p>Cuando se cree un complejo asociado a tu usuario, aparecerá aquí.</p>
                </div>
            )}
            <div className="complexes-grid">
                {complejos.map((complejo) => (
                    <article className="complex-card" key={complejo.id}>
                        <div className="complex-card-mark">{complejo.nombre.charAt(0).toUpperCase()}</div>
                        <div>
                            <h2>{complejo.nombre}</h2>
                            <p>Complejo #{complejo.id}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}