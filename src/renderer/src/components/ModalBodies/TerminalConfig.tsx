import { TASK, WSConnectedClient } from '@shared/types'
import AsyncOption from './theme-config-components/AsyncOption'
import { stateStyle, terminalLongState } from '@renderer/utils/stringUtils'
import DeleteSvg from '../../assets/trash.svg?react'

interface Props {
    terminal: WSConnectedClient
    fireTask: (v: TASK, id: string[]) => Promise<void>
    closeModal: () => void
}

const TerminalModalConfig = ({ terminal, fireTask, closeModal }: Props): React.JSX.Element => {
    // const [loading, setLoading] = useState(false)

    return (
        <div className="terminal-modal-container">
            <div>
                <h1>{terminal.name}</h1>
                <p className={stateStyle(terminal.status)}>{terminalLongState(terminal.status)}</p>
                <code>{terminal.ip}</code>
            </div>

            <div className="theme-config-modal-options">
                <AsyncOption
                    title={'Sync Theme'}
                    action={() => fireTask(TASK.SYNC_THEME, [terminal.id])}
                    status={null}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Sync Ads'}
                    action={() => fireTask(TASK.SYNC_ADS, [terminal.id])}
                    status={null}
                    disabled={true}
                />
                <AsyncOption
                    title={'OOS'}
                    action={() => fireTask(TASK.OOS, [terminal.id])}
                    status={null}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Alert'}
                    action={() => fireTask(TASK.ALERT, [terminal.id])}
                    status={null}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Reboot'}
                    action={() => fireTask(TASK.REBOOT, [terminal.id])}
                    status={null}
                    disabled={terminal.status === 2}
                />
                <AsyncOption
                    title={'Eliminar'}
                    action={async () => {}}
                    status={null}
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
