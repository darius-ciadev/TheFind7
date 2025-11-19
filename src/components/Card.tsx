type Props = {
    title: string
    description?: string
}

export default function Card({ title, description }: Props) {
    return (
        <article className="card">
            <h3>{title}</h3>
            <p>{description}</p>
        </article>
    )
}
