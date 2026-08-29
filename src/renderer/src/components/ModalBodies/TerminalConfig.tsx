import { TASK, WSClientStatus, WSConnectedClient } from '@renderer/types/types.d'
import AsyncOption from './theme-config-components/AsyncOption'
import { stateStyle, terminalLongState } from '@renderer/utils/stringUtils'
import DeleteSvg from '../../assets/trash.svg?react'
import { useState } from 'react'

interface Props {
    terminal: WSConnectedClient
    fireTask: (v: TASK, id: string[]) => Promise<void>
    closeModal: () => void
}

const TerminalModalConfig = ({ terminal, fireTask, closeModal }: Props): React.JSX.Element => {
    const [loading] = useState(terminal.status === WSClientStatus.RUNNING_TASK ? null : true)

    return (
        <div className="terminal-modal-container">
            <div>
                <h1>{terminal.name}</h1>
                <p className={stateStyle(terminal.status)}>{terminalLongState(terminal.status)} {terminal.description ?? ''}</p>
                <code>{terminal.ip}</code>
            </div>

            <div className="theme-config-modal-options">
                <AsyncOption
                    title={'Sync Diagram'}
                    action={() => fireTask(TASK.SYNC_DIAGRAM, [terminal.id])}
                    status={loading}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Sync Theme'}
                    action={() => fireTask(TASK.SYNC_THEME, [terminal.id])}
                    status={loading}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Sync Ads'}
                    action={() => fireTask(TASK.SYNC_ADS, [terminal.id])}
                    status={loading}
                    disabled={true}
                />
                <AsyncOption
                    title={'OOS'}
                    action={() => fireTask(TASK.OOS, [terminal.id])}
                    status={loading}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Alert'}
                    action={() => fireTask(TASK.ALERT, [terminal.id])}
                    status={loading}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Reboot'}
                    action={() => fireTask(TASK.REBOOT, [terminal.id])}
                    status={loading}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Eliminar'}
                    action={async () => {}}
                    status={loading}
                    Icon={<DeleteSvg />}
                    disabled={true}
                    style="tertiary"
                />
            </div>

            <div className="actions">
                <div className="action">
                    <a target="_blank" rel="noreferrer" onClick={closeModal}>
                        Cerrar
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TerminalModalConfig
