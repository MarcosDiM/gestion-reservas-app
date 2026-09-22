import { NavLink, Outlet } from 'react-router-dom'

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
                <NavLink className="logout-link" to="/">
                    Cerrar sesión
                </NavLink>
            </header>
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    )
}