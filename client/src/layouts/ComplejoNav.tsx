import { useEffect, useState } from 'react'
import { Grid2X2, House, LogOut, Users, UserRoundCog } from 'lucide-react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { obtenerComplejo } from '../api/complejos'
import './ComplejoNav.css'

export function ComplejoNav() {
    const navigate = useNavigate()
    const { complejoId } = useParams()
    const [nombreComplejo, setNombreComplejo] = useState('Título Complejo')
    const usuarioGuardado = localStorage.getItem('auth_user')
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) as { nombre?: string; usuario?: string } : null

    useEffect(() => {
        const id = Number(complejoId)

        if (!Number.isInteger(id)) {
            return
        }

        let activo = true

        async function cargarComplejo() {
            const data = await obtenerComplejo(id)
            if (activo) {
                setNombreComplejo(data.complejo.nombre)
            }
        }

        void cargarComplejo().catch(() => undefined)

        return () => {
            activo = false
        }
    }, [complejoId])

    function cerrarSesion() {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        navigate('/login')
    }

    return (
        <div className="complejo-shell">
            <aside className="complejo-sidebar">
                <div className="complejo-brand">
                    <span className="complejo-brand-icon"><House size={20} strokeWidth={2.4} /></span>
                    <strong>{nombreComplejo}</strong>
                </div>

                <nav className="complejo-menu" aria-label="Navegación del complejo">
                    <p className="complejo-menu-label">Reservas</p>
                    <NavLink className="complejo-menu-link" end to={`/app/complejo/${complejoId}`}>
                        <Grid2X2 size={18} />
                        <span>Planilla de Reservas</span>
                    </NavLink>
                    <NavLink className="complejo-menu-link" to={`/app/complejo/${complejoId}/gestion`}>
                        <Grid2X2 size={18} />
                        <span>Gestión de Reservas</span>
                    </NavLink>
                    <NavLink className="complejo-menu-link" to={`/app/complejo/${complejoId}/unidades`}>
                        <House size={18} />
                        <span>Unidades Reservables</span>
                    </NavLink>

                    <p className="complejo-menu-label complejo-menu-label-users">Gestión de usuarios</p>
                    <NavLink className="complejo-menu-link complejo-menu-link-muted" to={`/app/complejo/${complejoId}/huespedes`}>
                        <Users size={18} />
                        <span>Huéspedes</span>
                    </NavLink>
                    <NavLink className="complejo-menu-link complejo-menu-link-muted" to={`/app/complejo/${complejoId}/usuarios`}>
                        <UserRoundCog size={18} />
                        <span>Usuarios</span>
                    </NavLink>
                </nav>

                <div className="complejo-user-card">
                    <div>
                        <strong>{usuario?.nombre ?? 'Nombre Usuario'}</strong>
                        <span>{usuario?.usuario ?? 'Administrador'}</span>
                    </div>
                    <button type="button" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={cerrarSesion}>
                        <LogOut size={17} />
                    </button>
                </div>
            </aside>

            <main className="complejo-content">
                <Outlet />
            </main>
        </div>
    )
}
