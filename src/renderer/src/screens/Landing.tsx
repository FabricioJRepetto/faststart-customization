import { useAtom, useSetAtom } from 'jotai'
import NATL from '../assets/NATL-logo.svg'
import Versions from '../components/Versions'
import {
    AppVersionDirectoryAtom,
    BaseDirectoryAtom,
    CurrentScreenAtom,
    DefaultLanguageDataAtom,
    EditedLanguageDataAtom,
    LanguageDataStructureAtom
} from '@renderer/utils/context/context'
import { Screens } from '@renderer/utils/types'
import { langDataShell } from '@renderer/utils/LangStructureBuilder'
import { DEFAULT_LANGUAGE_DATA_DIR } from '../utils/CONSTANTS'

// TODO Seleccionar solo el directio base y buscar las versiones de cliente, luego abrir un dialogo para que el usuario seleccione la que desea administrar
// TODO Checkear que los directorios seleccionados tienen la estructura correcta antes de avanzar

const Landing = (): React.JSX.Element => {
    const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
    const setScreen = useSetAtom(CurrentScreenAtom)
    const setLangData = useSetAtom(DefaultLanguageDataAtom)
    const setNweLangData = useSetAtom(EditedLanguageDataAtom)
    const setLangDataStructure = useSetAtom(LanguageDataStructureAtom)
    const [baseDir, setBaseDir] = useAtom(BaseDirectoryAtom)
    const [versionDir, setVersionDir] = useAtom(AppVersionDirectoryAtom)

    const openSelectDirectory = async (tag: string): Promise<void> => {
        const path = await window.electronAPI.selectDirectory()
        if (path) {
            console.log(path)
            tag === 'base-dir' ? setBaseDir(path) : setVersionDir(path)
        }
    }

    const continueHandler = async (): Promise<void> => {
        if (!baseDir || !versionDir)
            return alert('Por favor, seleccione ambos directorios para continuar')

        const res = await window.electronAPI.getDefaultLanguageData(
            versionDir + DEFAULT_LANGUAGE_DATA_DIR
        )
        if (res.data) {
            setLangData(res.data)
            setNweLangData(res.data)
            setLangDataStructure(langDataShell(res.data))
            setScreen(Screens.main)
        } else {
            alert('Error al cargar los datos de idioma por defecto: ' + res.error)
        }
    }

    return (
        <>
            <img alt="logo" className="logo" src={NATL} />
            <div className="creator">Versión de desarrollo</div>
            <div className="text">
                Administrador de assets custom para <span className="gradient-text">FastStart</span>
            </div>
            <p className="tip">
                Seleccione el directorio base de faststart para comenzar a administrar sus assets.
            </p>
            <p className="tip">
                baseDir: <code>{baseDir}</code>
            </p>
            <p className="tip">
                versionDir: <code>{versionDir}</code>
            </p>
            <div className="actions">
                <div className="action">
                    <input type="file" id="base-dir-input" style={{ display: 'none' }} />
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => openSelectDirectory('base-dir')}
                    >
                        Seleccionar Directorio Base
                    </a>
                </div>
                <div className="action">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => openSelectDirectory('version')}
                    >
                        Seleccionar Versión
                    </a>
                </div>
                <div className="action">
                    <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
                        Send IPC test
                    </a>
                </div>
            </div>
            <div className="actions">
                <div className="action primary">
                    <a target="_blank" rel="noreferrer" onClick={continueHandler}>
                        Continuar
                    </a>
                </div>
            </div>
            <Versions></Versions>
        </>
    )
}

export default Landing
