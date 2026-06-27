import Modal from '@renderer/components/Modal'
import ThemeSettings from '@renderer/components/ModalBodies/ThemeConfig'
import ThemeCard from '@renderer/components/AssetsCards/ThemeCard'
import Tooltip from '@renderer/components/Tooltip'
import {
    loadLocalAssets,
    loadLocalCustomConfigFile,
    loadLocalLanguageFile,
    loadLocalThemesLibrary,
    loadRemoteThemesCollection,
    validateFiles
} from '@renderer/utils/bootSequence'
import {
    ClientAppVersionDirAtom,
    DefaultStylesDataAtom,
    DistributionMethodAtom,
    store,
    SupervisorAppVersionDirAtom,
    ThemesLibraryDataAtom,
    ThirdAppVersionDirAtom
} from '@renderer/utils/context/context'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { DistributionMethod } from '@shared/types'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'

const Collections = (): React.JSX.Element => {
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE

    const [collection] = useAtom(ThemesLibraryDataAtom)
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const thirdVersionDir = useAtomValue(ThirdAppVersionDirAtom)
    const supVersionDir = useAtomValue(SupervisorAppVersionDirAtom)

    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState<{ title: string; text?: string } | false>(false)
    const [deleteModal, setDeleteModal] = useState<
        { title: string; text?: string; value: string } | false
    >(false)

    const applyTheme = async (themeName: string): Promise<void> => {
        try {
            setLoading(true)
            console.log('aplicando el tema:', themeName)

            const res = await window.electronAPI.applyTheme(
                themeName,
                clientDir,
                thirdVersionDir,
                supVersionDir
            )
            if (res.success) {
                console.log('success')

                store.set(DefaultStylesDataAtom, undefined)

                await loadLocalAssets(clientDir, thirdVersionDir)
                await loadLocalLanguageFile(clientDir)
                await loadLocalCustomConfigFile(clientDir)
                validateFiles()

                setModal({
                    title: `Tema ${themeName} aplicado correctamente`,
                    text: 'Los cambios se reflejarán en las aplicaciones la próxima vez que cliente pase por la pantalla Idle.'
                })
            } else {
                console.log('failed', res.error)
                setModal({ title: 'Error aplicando el tema', text: res.error })
            }

            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const openDeleteModal = (v: string): void => {
        setDeleteModal({
            title: `¿Seguro desea borrar el tema ${v}?`,
            text: `Esta acción se va a efectuar ${isRemote ? 'en el servidor' : 'de manera local'} y no se puede deshacer.`,
            value: v
        })
    }

    const deleteTheme = async (themeName: string): Promise<void> => {
        setLoading(true)

        if (isRemote) {
            await deleteRemoteTheme(themeName)
        } else {
            await deleteLocalTheme(themeName)
        }

        setLoading(false)
    }

    const deleteLocalTheme = async (themeName: string): Promise<void> => {
        const res = await window.electronAPI.deleteTheme(themeName)
        if (res.success) {
            await loadLocalThemesLibrary()

            setDeleteModal(false)
            setModal({ title: `Tema ${themeName} borrado correctamente` })
        } else {
            setDeleteModal(false)
            setModal({ title: `Error al borrar tema`, text: res.error })
        }
    }

    //_-_-_-_-_-_-_-_-_-_- REMOTE _-_-_-_-_-_-_-_-_-_-
    const [settingsModal, setSettingsModal] = useState<{ themeName: string } | false>(false)

    const deleteRemoteTheme = async (themeName: string): Promise<void> => {
        try {
            const res = await mediaServiceController.deleteTheme(themeName)

            if (res) {
                await loadRemoteThemesCollection()

                setDeleteModal(false)
                setModal({ title: `Tema ${themeName} borrado correctamente` })
            } else {
                setDeleteModal(false)
                setModal({ title: `Error al borrar tema` })
            }
        } catch (error) {
            setDeleteModal(false)
            setModal({ title: `Error al borrar tema`, text: JSON.stringify(error) })
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>
                    Colecciones
                    <Tooltip
                        text={
                            'En esta sección se meustran "temas" (conjuntos de customizaciones) que han sido guardados previamente para favorecer la rápida aplicación de estilos.'
                        }
                    />
                </h1>
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
                            isDefault={t.isDefaultTheme}
                            applyCb={(v: string) => !loading && applyTheme(v)}
                            deleteCb={(v: string) => !loading && openDeleteModal(v)}
                            openSettings={(v: string) =>
                                !loading && setSettingsModal({ themeName: v })
                            }
                        />
                    ))
                ) : (
                    <h2>No themes found</h2>
                )}
            </div>

            {modal && (
                <Modal confirm={() => setModal(false)} close={() => setModal(false)}>
                    <h2>{modal.title}</h2>
                    <p>{modal.text}</p>
                    <div className="actions">
                        <div className="action primary">
                            <a onClick={() => setModal(false)}>Continuar</a>
                        </div>
                    </div>
                </Modal>
            )}

            {deleteModal && (
                <Modal confirm={() => setDeleteModal(false)} close={() => setDeleteModal(false)}>
                    <h2>{deleteModal.title}</h2>
                    <p>{deleteModal.text}</p>
                    <div className="actions">
                        <div className="action">
                            <a onClick={() => setDeleteModal(false)}>Cancelar</a>
                        </div>
                        <div className="action tertiary">
                            <a onClick={() => deleteTheme(deleteModal.value)}>Sí, borrar</a>
                        </div>
                    </div>
                </Modal>
            )}

            {settingsModal && (
                <Modal
                    confirm={() => setSettingsModal(false)}
                    close={() => setSettingsModal(false)}
                >
                    <ThemeSettings
                        themeData={
                            collection!.find((t) => t.themeName === settingsModal.themeName)!
                        }
                        closeModal={() => setSettingsModal(false)}
                    />
                </Modal>
            )}
        </div>
    )
}
export default Collections
