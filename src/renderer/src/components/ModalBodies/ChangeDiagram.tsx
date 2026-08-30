import {
    DefaultConfigurationsAtom,
    DiagramsCollectionDataAtom
} from '@renderer/utils/context/context'
import { useAtomValue, useSetAtom } from 'jotai'
import { FlowDiagram } from '@renderer/types/types.d'
import DefaultSvg from '../../assets/star.svg?react'
import { CurrentDiagramData, EditingDiagram, FlowEdges, FlowNodes } from '../Architect/FlowStorage'

interface Props {
    closeModal: () => void
}

const ChangeDiagram = ({ closeModal }: Props): React.JSX.Element => {
    const defaultDiagram = useAtomValue(DefaultConfigurationsAtom)?.diagram?.name
    const collection = useAtomValue(DiagramsCollectionDataAtom)

    const setEditing = useSetAtom(EditingDiagram)
    const setData = useSetAtom(CurrentDiagramData)

    const setNodes = useSetAtom(FlowNodes)
    const setEdges = useSetAtom(FlowEdges)

    const loadDiagram = (diagram: FlowDiagram): void => {
        console.log(
            `Setting diagram ${diagram.version} for edition.\n${Object.entries(diagram?.nodes)?.length} nodes - ${Object.entries(diagram.edges)?.length} edges`
        )
        if (diagram) {
            setEditing(true)
            setData(diagram)
        }
        if (diagram?.nodes) setNodes(Object.values(diagram.nodes))
        if (diagram?.edges) setEdges(diagram.edges)
    }

    const exit = (): void => closeModal()

    return (
        <div className="upload-modal-container">
            <h1>Cargar Diagrama</h1>
            <p className="upload-modal-aditional-info">Seleccionar diagrama:</p>

            <div className="diagrams-modal-container scrollable">
                {collection?.length ? (
                    collection.map((d) => (
                        <div
                            key={d.name + d.version}
                            className="terminal-container"
                            onClick={() => loadDiagram(d)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>
                                {d.name === defaultDiagram && (
                                    <label>
                                        <DefaultSvg />
                                    </label>
                                )}
                                <p>{d.name}</p>
                            </span>
                            <code>v{d.version}</code>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#bebebe41' }}>No se encontraron diagramas guardados</p>
                )}
            </div>

            <div className="actions">
                <div className="action">
                    <a onClick={exit}>Cancelar</a>
                </div>
            </div>
        </div>
    )
}

export default ChangeDiagram
