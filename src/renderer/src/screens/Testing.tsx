import { WS_BASE_URL } from '@shared/CONSTANTS'
import WSService from '@renderer/utils/controllers/WebSocketService/WebSocketServiceController'
import { CurrentScreenAtom, ServerStatusAtom, store, WebSocketStatusAtom } from '@renderer/utils/context/context'
import { useAtomValue, useSetAtom } from 'jotai'
import { Screens, TASK, WSConnectedClient, WSMessageType } from '@shared/types'
import Modal from '@renderer/components/Modal'
import { useState } from 'react'
import TerminalModalConfig from '@renderer/components/ModalBodies/TerminalConfig'
import { TerminalsCardRow } from '@renderer/components/CardsRow'

const Testing = (): React.JSX.Element => {
    const ServerStatus = useAtomValue(ServerStatusAtom, { store })
    const WsStatus = useAtomValue(WebSocketStatusAtom, { store })
    const changeScreen = useSetAtom(CurrentScreenAtom)

    const [modal, setModal] = useState<WSConnectedClient | null>()

    const fireTask = async (task: TASK, id?: string[]): Promise<void> => {
        WSService.emit({ type: WSMessageType.fire_task, data: { task, terminals: id } })
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>TESTING</h1>

                <div className="header-group">
                    <div className="header-server-status">
                        <div>
                            <code>Servidor</code>
                            <span
                                className={
                                    ServerStatus == undefined
                                        ? 'getting-status'
                                        : ServerStatus
                                          ? 'green-status'
                                          : 'red-status'
                                }
                            ></span>
                        </div>
                        <div>
                            <code>WebSocket</code>
                            <span
                                className={
                                    WsStatus == undefined
                                        ? 'getting-status'
                                        : WsStatus
                                          ? 'green-status'
                                          : 'red-status'
                                }
                            ></span>
                        </div>
                        <div>
                            <code>{WSService.clientID || '---'}</code>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <TerminalsCardRow cardClick={setModal} />
            </div>

            <div
                className="actions"
                style={{ marginTop: '.5rem', width: '88%', justifyContent: 'start' }}
            >
                <div className="action primary">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => WSService.init(WS_BASE_URL, 'ƒAB')}
                    >
                        Conectar WS
                    </a>
                </div>
                <div className="action tertiary">
                    <a target="_blank" rel="noreferrer" onClick={WSService.close}>
                        Desconectar WS
                    </a>
                </div>
                <div className="action">
                    <a target="_blank" rel="noreferrer" onClick={() => fireTask(TASK.SYNC_THEME)}>
                        TASK: Sync theme (all)
                    </a>
                </div>
            </div>

            <div
                className="actions"
                style={{ marginTop: '.5rem', width: '88%', justifyContent: 'start' }}
            >
                <div className="action">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => changeScreen(Screens.architect)}
                    >
                        Flow Architect
                    </a>
                </div>
            </div>

            {modal && (
                <Modal confirm={() => null} close={() => setModal(null)}>
                    <TerminalModalConfig
                        terminal={modal}
                        fireTask={fireTask}
                        closeModal={() => setModal(null)}
                    />
                </Modal>
            )}
        </div>
    )
}

export default Testing
