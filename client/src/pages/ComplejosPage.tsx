import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { crearComplejo, obtenerComplejos } from '../api/complejos'
import type { ApiErrorResponse, Complejo } from '../types/api'
import { useNavigate } from 'react-router-dom'
import './ComplejosPage.css'

export function ComplejosPage() {
    const navigate = useNavigate()
    const [complejos, setComplejos] = useState<Complejo[]>([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [nombreNuevoComplejo, setNombreNuevoComplejo] = useState('')
    const [creando, setCreando] = useState(false)

    useEffect(() => {
        async function cargarComplejos() {
            try {
                const data = await obtenerComplejos()
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

    async function guardarComplejo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setCreando(true)

        try {
            const data = await crearComplejo({ nombre: nombreNuevoComplejo })
            setComplejos((complejosActuales) => [...complejosActuales, data.complejo])
            setNombreNuevoComplejo('')
            setModalAbierto(false)
        } catch (requestError) {
            if (axios.isAxiosError<ApiErrorResponse>(requestError)) {
                setError(requestError.response?.data.message ?? 'No se pudo crear el complejo.')
            } else {
                setError('No se pudo crear el complejo.')
            }
        } finally {
            setCreando(false)
        }
    }

    return (
        <section className="complexes-page" aria-labelledby="complexes-title">
            <div className="complexes-heading">
                <div>
                    <h1 id="complexes-title">Seleccionar Complejo</h1>
                    <p>Elegí el complejo que querés gestionar para acceder a su planilla de reservas.</p>
                </div>
            </div>
            {cargando && <p className="status-message">Cargando complejos...</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            {!cargando && <div className="complexes-grid">
                {complejos.map((complejo) => (
                    <article className="complex-card" key={complejo.id}>
                        <div className="complex-card-top">
                            <div className="complex-card-mark">{complejo.nombre.charAt(0).toUpperCase()}</div>
                            <span className="complex-status">ACTIVO</span>
                        </div>
                        <div className="complex-card-body">
                            <h2>{complejo.nombre}</h2>
                            
                        </div>
                        <div className="complex-card-footer">
                            <span className="complex-units">Complejo {complejo.id}</span>
                            <button type="button" onClick={() => navigate(`/app/complejo/${complejo.id}`)}>Gestionar</button>
                        </div>
                    </article>
                ))}
                <button className="new-complex-card" type="button" onClick={() => setModalAbierto(true)}>
                    <span className="new-complex-icon" aria-hidden="true">+</span>
                    <strong>Nuevo Complejo</strong>
                    <span>Registrar una nueva propiedad</span>
                </button>
            </div>}
            {modalAbierto && (
                <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalAbierto(false)}>
                    <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-complex-title" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="modal-heading">
                            <div>
                                <p className="eyebrow">Administración</p>
                                <h2 id="create-complex-title">Nuevo Complejo</h2>
                            </div>
                            <button className="modal-close" type="button" aria-label="Cerrar" onClick={() => setModalAbierto(false)}>×</button>
                        </div>
                        <form className="create-complex-form" onSubmit={guardarComplejo}>
                            <label htmlFor="nombre-complejo">Nombre del complejo</label>
                            <input
                                id="nombre-complejo"
                                value={nombreNuevoComplejo}
                                onChange={(event) => setNombreNuevoComplejo(event.target.value)}
                                placeholder="Ej. Complejo Las Sierras"
                                required
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button className="cancel-button" type="button" onClick={() => setModalAbierto(false)}>Cancelar</button>
                                <button className="confirm-button" type="submit" disabled={creando}>
                                    {creando ? 'Guardando...' : 'Crear Complejo'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </section>
    )
}