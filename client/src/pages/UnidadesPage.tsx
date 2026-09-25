import { PagePlaceholder } from './PagePlaceholder'
import { useParams } from 'react-router-dom'

export function UnidadesPage() {
  const { complejoId } = useParams()

  return <PagePlaceholder title="Unidades reservables" description={`Administración de alojamientos o unidades disponibles del complejo #${complejoId}.`} />
}