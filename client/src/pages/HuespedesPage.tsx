import { PagePlaceholder } from './PagePlaceholder'
import { useParams } from 'react-router-dom'

export function HuespedesPage() {
    const { complejoId } = useParams()

    return <PagePlaceholder title="Huéspedes" description={`Registro y consulta de huéspedes del complejo #${complejoId}.`} />
}