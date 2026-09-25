import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { ComplejoNav } from '../layouts/ComplejoNav'
import { ComplejosPage } from '../pages/ComplejosPage'
import { GestionReservasPage } from '../pages/GestionReservasPage'
import { HuespedesPage } from '../pages/HuespedesPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ReservasPage } from '../pages/ReservasPage'
import { UnidadesPage } from '../pages/UnidadesPage'
import { UsuariosPage } from '../pages/UsuariosPage'

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/app" element={<AppLayout />}>
                    <Route index element={<Navigate replace to="dashboard" />} />
                    <Route path="complejos" element={<ComplejosPage />} />
                    <Route path="unidades" element={<UnidadesPage />} />
                    <Route path="huespedes" element={<HuespedesPage />} />
                    <Route path="usuarios" element={<UsuariosPage />} />
                </Route>
                <Route path="/app/complejo/:complejoId" element={<ComplejoNav />}>
                    <Route index element={<ReservasPage />} />
                    <Route path="gestion" element={<GestionReservasPage />} />
                    <Route path="unidades" element={<UnidadesPage />} />
                    <Route path="huespedes" element={<HuespedesPage />} />
                    <Route path="usuarios" element={<UsuariosPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}