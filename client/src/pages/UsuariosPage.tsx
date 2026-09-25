import { PagePlaceholder } from './PagePlaceholder'
import { useParams } from 'react-router-dom'

export function UsuariosPage() {
    const { complejoId } = useParams()

    return <PagePlaceholder title="Usuarios" description={`Administración de usuarios y permisos del complejo #${complejoId}.`} />
}