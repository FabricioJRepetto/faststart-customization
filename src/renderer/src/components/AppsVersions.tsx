import { useAtomValue } from 'jotai'
import {
    ClientAppVersionDirAtom,
    SupervisorAppVersionDirAtom,
    ThirdAppVersionDirAtom
} from '@renderer/utils/context/context'

export const AppsVersions = (): React.JSX.Element => {
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const superVersionDir = useAtomValue(SupervisorAppVersionDirAtom)
    const thirdVersionDir = useAtomValue(ThirdAppVersionDirAtom)

    return (
        <ul className="app-versions">
            <li className="electron-version">
                Cliente v{clientDir.split('/').pop()?.split('-').pop()}
            </li>
            <li className="electron-version">
                Supervisor v{superVersionDir.split('/').pop()?.split('-').pop()}
            </li>
            <li className="electron-version">
                Tercer pantalla v{thirdVersionDir.split('/').pop()?.split('-').pop()}
            </li>
        </ul>
    )
}
export default AppsVersions
