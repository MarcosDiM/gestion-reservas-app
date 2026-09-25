import { Outlet, useNavigate } from 'react-router-dom'
import './AppLayout.css'

export function AppLayout() {
    const navigate = useNavigate()
    const usuarioGuardado = localStorage.getItem('auth_user')
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) as { nombre?: string; usuario?: string } : null

    function cerrarSesion() {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        navigate('/login')
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="user-actions">
                    <div className="user-summary">
                        <strong>{usuario?.nombre ?? 'Nombre Usuario'}</strong>
                        <span>{usuario?.usuario ?? 'Administrador'}</span>
                    </div>
                    <button className="logout-link" type="button" onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                </div>
            </header>
            <main className="app-content">
                <Outlet />
            </main>
            <footer className="app-footer">Título Complejo © 2025 · Todos los derechos reservados.</footer>
        </div>
    )
}