import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="page home-page">
      <h1>Sistema de Gestión de Reservas</h1>
      <Link className="login-button" to="/login">
        Iniciar sesión
      </Link>
    </main>
  )
}