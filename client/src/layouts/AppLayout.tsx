import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './AppLayout.css'

const sections = [
    { label: 'Resumen', path: '/app/dashboard' },
    { label: 'Complejos', path: '/app/complejos' },
    { label: 'Unidades reservables', path: '/app/unidades' },
    { label: 'Reservas', path: '/app/reservas' },
    { label: 'Huéspedes', path: '/app/huespedes' },
    { label: 'Pagos', path: '/app/pagos' },
    { label: 'Comprobantes', path: '/app/comprobantes' },
    { label: 'Usuarios', path: '/app/usuarios' },
]

export function AppLayout() {
    const navigate = useNavigate()

    function cerrarSesion() {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        navigate('/login')
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <NavLink className="brand" to="/app/dashboard">
                    Gestión de Reservas
                </NavLink>
                <nav aria-label="Secciones principales">
                    {sections.map((section) => (
                        <NavLink
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            key={section.path}
                            to={section.path}
                        >
                            {section.label}
                        </NavLink>
                    ))}
                </nav>
                <button className="logout-link" type="button" onClick={cerrarSesion}>
                    Cerrar sesión
                </button>
            </header>
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    )
}