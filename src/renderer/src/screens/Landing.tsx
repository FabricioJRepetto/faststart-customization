import { useAtom, useSetAtom } from 'jotai'
import NATL from '../assets/NATL-logo.svg'
import Versions from '../components/Versions'
import {
    AppSettingsAtom,
    AppVersionDirectoryAtom,
    AssetsDataAtom,
    BaseDirectoryAtom,
    CurrentScreenAtom,
    DefaultLanguageDataAtom,
    EditedAppSettingsAtom,
    EditedLanguageDataAtom,
    LanguageDataStructureAtom
} from '@renderer/utils/context/context'
import { AppSettingsData, AssetList, LanguageData, Screens } from '@renderer/utils/types'
import { langDataShell } from '@renderer/utils/LangStructureBuilder'
import {
    DEFAULT_ASSETS_DIR,
    DEFAULT_LANGUAGE_DATA_DIR,
    SERVICES_APPSETTINGS_DIR
} from '../utils/CONSTANTS'
import RightSvg from '../assets/right.svg?react'

// TODO Seleccionar solo el directio base y buscar las versiones de cliente, luego abrir un dialogo para que el usuario seleccione la que desea administrar
// TODO Checkear que los directorios seleccionados tienen la estructura correcta antes de avanzar

const Landing = (): React.JSX.Element => {
    const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
    const setScreen = useSetAtom(CurrentScreenAtom)
    const setLangData = useSetAtom(DefaultLanguageDataAtom)
    const setNewLangData = useSetAtom(EditedLanguageDataAtom)
    const setLangDataStructure = useSetAtom(LanguageDataStructureAtom)

    const setAppsettings = useSetAtom(AppSettingsAtom)
    const setNewAppsettings = useSetAtom(EditedAppSettingsAtom)

    const setAssetList = useSetAtom(AssetsDataAtom)

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
        try {
            if (!baseDir || !versionDir)
                return alert('Por favor, seleccione ambos directorios para continuar')

            //* language_default.json
            const res = await window.electronAPI.getJsonData(versionDir + DEFAULT_LANGUAGE_DATA_DIR)
            if (res.data) {
                console.log('language_default.json data OK')

                setLangData(res.data as LanguageData)
                setNewLangData(res.data as LanguageData)
                setLangDataStructure(langDataShell(res.data as LanguageData))
            } else {
                console.error('Error al cargar archivo de idioma por defecto: ' + res.error)
                throw res.error
            }

            //* appsettings.json TS
            const resSettings = await window.electronAPI.getJsonData(
                baseDir + SERVICES_APPSETTINGS_DIR
            )
            if (resSettings.data) {
                console.log('appsettings.json data OK')

                setAppsettings(resSettings.data as AppSettingsData)
                setNewAppsettings(resSettings.data as AppSettingsData)
            } else {
                console.error('Error al cargar archivo appsettings: ' + resSettings.error)
                throw resSettings.error
            }

            //* assets
            const resAssets = await window.electronAPI.getFilesList(versionDir + DEFAULT_ASSETS_DIR)
            if (resAssets.data) {
                console.log('assets data OK')
                console.log(resAssets.data)
                setAssetList(resAssets.data as AssetList)
            } else {
                console.error('Error al cargar assets: ' + resAssets.error)
                throw resAssets.error
            }
            setScreen(Screens.main)
        } catch (error) {
            alert('Error al cargar archivos: ' + error)
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
            <div className="actions landing-buttons">
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
                        <RightSvg />
                    </a>
                </div>
            </div>
            <Versions></Versions>
        </>
    )
}

export default Landing
