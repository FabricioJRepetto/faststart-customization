const Collections = (): React.JSX.Element => {
    const collection = []
    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Colleciones</h1>
            </div>
            <p>Temas guardados previamente</p>

            {collection?.length ? (
                collection.map((_, i) => <h2 key={i}>Saved theme #{i}</h2>)
            ) : (
                <h2>No themes found</h2>
            )}
        </div>
    )
}
export default Collections
