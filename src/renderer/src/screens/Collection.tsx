import ThemeCard from '@renderer/components/ThemeCard'
import { ThemesLibraryDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'

const Collections = (): React.JSX.Element => {
    const [collection] = useAtom(ThemesLibraryDataAtom)

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Colleciones</h1>
                <p>Temas guardados previamente</p>
            </div>

            <div className="assets-grid grid-styles scrolleable">
                {collection?.length ? (
                    collection.map((t, i) => <ThemeCard theme={t} key={i} />)
                ) : (
                    <h2>No themes found</h2>
                )}
            </div>
        </div>
    )
}
export default Collections
