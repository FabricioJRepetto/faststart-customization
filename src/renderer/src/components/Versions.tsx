import pckg from '../../../../package.json'
import { ServerStatusAtom, WebSocketStatusAtom } from '@renderer/utils/context/context'
import {  useAtomValue } from 'jotai'

function Versions(): React.JSX.Element {
    const server = useAtomValue(ServerStatusAtom)
    const websocket = useAtomValue(WebSocketStatusAtom)

    return (
        <ul className="versions">
            <li className="electron-version">
                Estado del servidor
                <span
                    className={
                        server == undefined ? 'getting-status' : server ? 'green-status' : 'red-status'
                    }
                ></span>
            </li>
            <li className="electron-version">
                WebSocket
                <span
                    className={
                        websocket == undefined ? 'getting-status' : websocket ? 'green-status' : 'red-status'
                    }
                ></span>
            </li>
            <li className="electron-version">Desktop version {pckg.version}</li>
        </ul>
    )
}

export default Versions
