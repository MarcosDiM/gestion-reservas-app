import { Link } from 'react-router-dom'

export function LoginPage() {
    return (
        <main className="page">
            <h1>Inicio de sesión</h1>
            <p>El formulario de acceso se desarrollará en esta página.</p>
            <Link to="/app/dashboard">Continuar a la aplicación</Link>
            <Link to="/">Volver al inicio</Link>
        </main>
    )
}