import './PagePlaceholder.css'

interface PagePlaceholderProps {
    title: string
    description: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
    return (
        <section className="placeholder-page">
            <p className="eyebrow">Módulo</p>
            <h1>{title}</h1>
            <p>{description}</p>
        </section>
    )
}