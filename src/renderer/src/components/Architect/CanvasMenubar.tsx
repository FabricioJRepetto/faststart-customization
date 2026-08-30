import Tooltip from '@renderer/components/Tooltip'
import HomeSvg from '../../assets/home.svg?react'
import ResetSvg from '../../assets/undo.svg?react'
import BoltSvg from '../../assets/bolt.svg?react'
import SpinnerSvg from '../../assets/spinner.svg?react'
import SaveSvg from '../../assets/save.svg?react'
import LoadSvg from '../../assets/download.svg?react'
import SignalSvg from '../../assets/wifi.svg?react'
import MenuSvg from '../../assets/options.svg?react'
import { useAtom, useSetAtom } from 'jotai'
import { CurrentScreenAtom, store } from '@renderer/utils/context/context'
import { CurrentDiagramData, EditingDiagram, FlowEdges, FlowNodes } from './FlowStorage'
import { initialEdges, initialNodes } from './utils/presets'
import { FlowDiagram, Screens } from '@renderer/types/types.d'
import { useState } from 'react'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import {
    loadDefaultConfigurations,
    loadDiagramsCollection,
    loadThemesCollection
} from '@renderer/utils/bootSequence'

interface Props {
    openUploadModal: () => void
    openChangeDiagramModal: () => void
    loading: boolean
}

const CanvasMenubar = ({
    openUploadModal,
    openChangeDiagramModal,
    loading
}: Props): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)
    const setNodes = useSetAtom(FlowNodes)
    const setEdges = useSetAtom(FlowEdges)
    const [editing, setEditing] = useAtom(EditingDiagram)
    const [data, setData] = useAtom(CurrentDiagramData)

    const [_loading, _setLoading] = useState<boolean>(false)

    const resetDiagram = (): void => {
        setNodes(initialNodes)
        setEdges(initialEdges)
        setData(null)
        setEditing(false)
    }

    const fastSave = async (): Promise<void> => {
        try {
            if (!data) return
            _setLoading(true)

            const nodes = {}
            store.get(FlowNodes).map((n) => {
                nodes[n.id] = n
            })

            const _diagram: FlowDiagram = {
                name: data.name,
                version: data.version,
                entry: 'idle',
                nodes,
                // TODO - Generar edges a partir de los nodos al descargar el diagrama para que no haga falta agregarlos al diagrama final?
                edges: store.get(FlowEdges)
            }

            //* Preparar y subir archivo diagrama
            const uploadRes = await mediaServiceController.uploadDiagram(_diagram, data.name)
            if (!uploadRes) console.warn('Ningún archivo subido')

            //* Actualizar Themes Collection
            await loadThemesCollection()
            //* Actualizar Diagrams Collection
            await loadDiagramsCollection()
            //* Actualizar Default Configs
            await loadDefaultConfigurations()
        } catch (error) {
            console.error(error)
        } finally {
            _setLoading(false)
        }
    }

    return (
        <div className="architect-blueprint-header">
            <div className="header-group">
                <Tooltip text="Main">
                    <div className="header-icon" onClick={() => setScreen(Screens.main)}>
                        <HomeSvg />
                    </div>
                </Tooltip>
            </div>

            <h1>Architect</h1>

            <div className="header-group end-header">
                {editing && (
                    <p>
                        {data?.name} · v{data?.version}
                    </p>
                )}

                <Tooltip text="Sincronizar diagrama en terminales">
                    <div
                        className="action"
                        style={{
                            pointerEvents: 'none',
                            opacity: '.25'
                        }}
                    >
                        <a onClick={() => null}>
                            <SignalSvg />
                        </a>
                    </div>
                </Tooltip>

                <Tooltip text={'Guardado rapido'}>
                    <div
                        className="action primary"
                        style={{
                            pointerEvents: loading || !editing ? 'none' : 'all',
                            opacity: editing ? '1' : '.25'
                        }}
                    >
                        <a onClick={fastSave}>
                            {_loading && <SpinnerSvg className="spinner" />}
                            <BoltSvg
                                className="small-bolt"
                                style={{ opacity: _loading ? '0' : '1' }}
                            />
                            <SaveSvg style={{ opacity: _loading ? '0' : '1' }} />
                        </a>
                    </div>
                </Tooltip>
                <Tooltip text="Guardar como">
                    <div
                        className="action"
                        style={{
                            pointerEvents: !loading ? 'all' : 'none'
                        }}
                    >
                        <a onClick={openUploadModal}>
                            <SaveSvg />
                        </a>
                    </div>
                </Tooltip>
                <Tooltip text="Cargar diagrama">
                    <div
                        className="action"
                        style={{
                            pointerEvents: !loading ? 'all' : 'none'
                        }}
                    >
                        <a onClick={openChangeDiagramModal}>
                            <LoadSvg />
                        </a>
                    </div>
                </Tooltip>
                <Tooltip text="Resetear diagrama">
                    <div
                        className="action tertiary"
                        style={{
                            pointerEvents: !loading ? 'all' : 'none'
                        }}
                    >
                        <a onClick={resetDiagram}>
                            <ResetSvg />
                        </a>
                    </div>
                </Tooltip>
                <Tooltip text="Opciones del diagrama">
                    <div
                        className="action "
                        style={{
                            pointerEvents: 'none',
                            opacity: '.25'
                        }}
                    >
                        <a onClick={() => null}>
                            <MenuSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}

export default CanvasMenubar
