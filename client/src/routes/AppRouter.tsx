import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { ComprobantesPage } from '../pages/ComprobantesPage'
import { ComplejosPage } from '../pages/ComplejosPage'
import { DashboardPage } from '../pages/DashboardPage'
import { HuespedesPage } from '../pages/HuespedesPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PagosPage } from '../pages/PagosPage'
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
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="complejos" element={<ComplejosPage />} />
                    <Route path="unidades" element={<UnidadesPage />} />
                    <Route path="reservas" element={<ReservasPage />} />
                    <Route path="huespedes" element={<HuespedesPage />} />
                    <Route path="pagos" element={<PagosPage />} />
                    <Route path="comprobantes" element={<ComprobantesPage />} />
                    <Route path="usuarios" element={<UsuariosPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}