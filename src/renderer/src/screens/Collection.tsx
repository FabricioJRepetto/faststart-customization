import ThemeCard from '@renderer/components/ThemeCard'
import {
    loadAssets,
    loadCustomConfigFile,
    loadLanguageFile,
    loadStylesFile,
    loadThemesLibrary
} from '@renderer/utils/bootSequence'
import {
    ClientAppVersionDirAtom,
    SupervisorAppVersionDirAtom,
    ThemesLibraryDataAtom,
    ThirdAppVersionDirAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'

const Collections = (): React.JSX.Element => {
    const [collection] = useAtom(ThemesLibraryDataAtom)
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const thirdVersionDir = useAtomValue(ThirdAppVersionDirAtom)
    const supVersionDir = useAtomValue(SupervisorAppVersionDirAtom)

    const [loading, setLoading] = useState(false)

    const applyTheme = async (themeName: string): Promise<void> => {
        setLoading(true)
        console.log(themeName)

        await window.electronAPI.applyTheme(themeName, clientDir, thirdVersionDir, supVersionDir)
        //* RELOAD All Assets
        await loadAssets(clientDir, thirdVersionDir)
        await loadLanguageFile(clientDir)
        await loadStylesFile(clientDir)
        await loadCustomConfigFile(clientDir)

        setLoading(false)
    }

    const deleteTheme = async (themeName: string): Promise<void> => {
        setLoading(true)
        console.log(themeName)

        await window.electronAPI.deleteTheme(themeName)
        //* RELOAD Library
        await loadThemesLibrary()

        setLoading(false)
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Colleciones</h1>
                <p>Temas guardados previamente</p>
            </div>

            <div
                className="assets-grid grid-styles scrolleable"
                style={{ pointerEvents: loading ? 'none' : 'all' }}
            >
                {collection?.length ? (
                    collection.map((t, i) => (
                        <ThemeCard
                            key={i}
                            theme={t}
                            applyCb={(v: string) => !loading && applyTheme(v)}
                            deleteCb={(v: string) => !loading && deleteTheme(v)}
                        />
                    ))
                ) : (
                    <h2>No themes found</h2>
                )}
            </div>
        </div>
    )
}
export default Collections
