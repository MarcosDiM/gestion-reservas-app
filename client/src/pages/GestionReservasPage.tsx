import { PagePlaceholder } from './PagePlaceholder'
import { useParams } from 'react-router-dom'

export function GestionReservasPage() {
    const { complejoId } = useParams()

    return <PagePlaceholder title="Gestión de reservas" description={`Administración de reservas del complejo #${complejoId}.`} />
}
