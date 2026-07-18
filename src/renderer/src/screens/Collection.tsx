import Modal from '@renderer/components/Modal'
import ThemeModalSettings from '@renderer/components/ModalBodies/ThemeConfig'
import ThemeCard from '@renderer/components/AssetsCards/ThemeCard'
import Tooltip from '@renderer/components/Tooltip'
import { loadThemesCollection } from '@renderer/utils/bootSequence'
import { ThemesLibraryDataAtom } from '@renderer/utils/context/context'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { useAtom } from 'jotai'
import { useState } from 'react'

const Collections = (): React.JSX.Element => {
    const [collection] = useAtom(ThemesLibraryDataAtom)

    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState<{ title: string; text?: string } | false>(false)
    const [deleteModal, setDeleteModal] = useState<
        { title: string; text?: string; value: string } | false
    >(false)

    const openDeleteModal = (v: string): void => {
        setDeleteModal({
            title: `¿Seguro desea borrar el tema ${v}?`,
            text: `Esta acción se va a efectuar en el servidor y no se puede deshacer.`,
            value: v
        })
    }

    const deleteTheme = async (themeName: string): Promise<void> => {
        setLoading(true)
        await deleteRemoteTheme(themeName)
        setLoading(false)
    }
    
    const [settingsModal, setSettingsModal] = useState<{ themeName: string } | false>(false)

    const deleteRemoteTheme = async (themeName: string): Promise<void> => {
        try {
            const res = await mediaServiceController.deleteTheme(themeName)

            if (res) {
                await loadThemesCollection()

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
                    <ThemeModalSettings
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
