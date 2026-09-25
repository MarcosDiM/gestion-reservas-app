import { PagePlaceholder } from './PagePlaceholder'
import { useParams } from 'react-router-dom'

export function ReservasPage() {
    const { complejoId } = useParams()

    return <PagePlaceholder title="Reservas" description={`Gestión del calendario y del estado de las reservas del complejo #${complejoId}.`} />
}