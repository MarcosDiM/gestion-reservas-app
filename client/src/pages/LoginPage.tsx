import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { apiClient } from '../api/client'
import type { ApiErrorResponse, LoginResponse } from '../types/api'
import './LoginPage.css'

export function LoginPage() {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [mostrarContrasena, setMostrarContrasena] = useState(false)

    async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setCargando(true)

        try {
            const { data } = await apiClient.post<LoginResponse>('/auth/login', {
                usuario,
                contrasena,
            })

            localStorage.setItem('auth_token', data.token)
            localStorage.setItem('auth_user', JSON.stringify(data.usuario))
            navigate('/app/complejos')
        } catch (requestError) {
            if (axios.isAxiosError<ApiErrorResponse>(requestError)) {
                setError(requestError.response?.data.message ?? 'No se pudo iniciar sesión.')
            } else {
                setError('No se pudo iniciar sesión.')
            }
        } finally {
            setCargando(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-visual" aria-labelledby="login-title">
                <div className="auth-visual-content">
                    <p className="eyebrow">Gestión integral</p>
                    <h1 id="login-title">La forma más ágil de administrar tu complejo</h1>
                    <p>Sistema de Gestión de Reservas, huéspedes, unidades y analíticas en tiempo real para optimizar tu operación.</p>
                </div>
            </section>
            <section className="auth-form-side" aria-label="Acceso al sistema">
                <div className="login-panel">
                    <div className="login-intro">
                        <h2>Iniciar Sesión</h2>
                        <p>Ingresá tus credenciales para acceder al sistema</p>
                    </div>
                    <form className="login-form" onSubmit={iniciarSesion}>
                        <label htmlFor="usuario">Usuario</label>
                        <input
                            id="usuario"
                            autoComplete="username"
                            placeholder="nombre.usuario@complejo.com"
                            value={usuario}
                            onChange={(event) => setUsuario(event.target.value)}
                            required
                        />
                        <label htmlFor="contrasena">Contraseña</label>
                        <div className="password-field">
                            <input
                                id="contrasena"
                                type={mostrarContrasena ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="••••••••••••"
                                value={contrasena}
                                onChange={(event) => setContrasena(event.target.value)}
                                required
                            />
                            <button
                                className="password-toggle"
                                type="button"
                                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                onClick={() => setMostrarContrasena((visible) => !visible)}
                            >
                                {mostrarContrasena ? 'Ocultar' : 'Ver'}
                            </button>
                        </div>
                        {error && <p className="form-error" role="alert">{error}</p>}
                        <button className="submit-button" type="submit" disabled={cargando}>
                            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
                <p className="auth-footer">© 2026 Título Complejo. Todos los derechos reservados.</p>
            </section>
        </main>
    )
}