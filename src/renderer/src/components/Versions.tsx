import pckg from '../../../../package.json'
import { ServerStatusAtom } from '@renderer/utils/context/context'
import {  useAtomValue } from 'jotai'

function Versions(): React.JSX.Element {
    //   const [versions] = useState(window.electron.process.versions)
    const status = useAtomValue(ServerStatusAtom)

    return (
        <ul className="versions">
            <li className="electron-version">
                Estado del servidor
                <span
                    className={
                        status == undefined ? 'getting-status' : status ? 'green-status' : 'red-status'
                    }
                ></span>
            </li>
            <li className="electron-version">Desktop version {pckg.version}</li>
            {/* <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li> */}
        </ul>
    )
}

export default Versions
