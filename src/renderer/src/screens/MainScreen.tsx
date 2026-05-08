import { useAtom, useAtomValue } from 'jotai'
import {
    ClientAppVersionDirAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedStylesDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedThirdScreenDataAtom,
    AssetsDataAtom,
    CustomEnabledAtom,
    DefaultConfigAtom,
    FirstLoadAtom,
    ThirdAppVersionDirAtom,
    SupervisorAppVersionDirAtom
} from '@renderer/utils/context/context'
import { dataParser, languageParser, stylesDataParser } from '@renderer/utils/assetsUtils'
import { CustomConfig } from '@shared/types'
import { Previewer } from '@renderer/components/Previewer'
import { useEffect, useState } from 'react'
import CheckSvg from '../assets/check.svg?react'
import CancelSvg from '../assets/cancel.svg?react'
import AppsVersions from '@renderer/components/AppsVersions'

export const MainScreen = (): React.JSX.Element => {
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const thirdDir = useAtomValue(ThirdAppVersionDirAtom)
    const supDir = useAtomValue(SupervisorAppVersionDirAtom)

    const [customEnabled, setCustomEnabled] = useAtom(CustomEnabledAtom)

    const ogData = useAtomValue(AssetsDataAtom)!
    const defCustomConfig = useAtomValue(DefaultConfigAtom)
    const newIcons = useAtomValue(EditedIconsDataAtom)
    const newBgs = useAtomValue(EditedBackgroundsDataAtom)
    const newThird = useAtomValue(EditedThirdScreenDataAtom)
    const newAudios = useAtomValue(EditedAudiosDataAtom)
    const newStyles = useAtomValue(EditedStylesDataAtom)
    const newLangs = useAtomValue(EditedLanguageDataAtom)

    const [loading, setLoading] = useState<boolean>(false)
    const [firstLoad, setFirstLoad] = useAtom(FirstLoadAtom)

    useEffect(() => {
        setTimeout(() => setFirstLoad(false), 450)
    }, [setFirstLoad])

    const toggleCustomEnabled = async (): Promise<void> => {
        setLoading(true)
        setCustomEnabled(!customEnabled)
        if (defCustomConfig) {
            const aux = { ...defCustomConfig, customEnabled: !customEnabled }
            const res = await window.electronAPI.toggleEnabled(aux, clientDir, thirdDir, supDir)
            res.success
                ? console.log('Customs enabled correctly')
                : console.error('Error enabling customs')
        } else {
            console.log('No custom config loaded. Save one first.')
        }
        setLoading(false)
    }

    const saveConfig = async (): Promise<void> => {
        setLoading(true)
        const aux: CustomConfig = {
            version: '2.0.0',
            ID: new Date().getTime().toString(),
            customEnabled: true,
            icon: dataParser(ogData.icon, newIcons!),
            background: dataParser(ogData.background, newBgs!),
            thirdscreen: dataParser(ogData.thirdscreen, newThird!),
            audio: dataParser(ogData.audio, newAudios!),
            styles: stylesDataParser(newStyles!),
            language: languageParser(newLangs)
        }

        const res = await window.electronAPI.writeJsonData(aux, clientDir, thirdDir, supDir)

        if (res.success) console.log('[SAVE] Custom config file witen')
        else console.error('[SAVE] Custom config file creation failed')

        setLoading(false)
    }

    const applyConfig = async (): Promise<void> => {
        setLoading(true)
        const aux: CustomConfig = {
            version: '2.0.0',
            ID: new Date().getTime().toString(),
            customEnabled: customEnabled,
            icon: dataParser(ogData.icon, newIcons!),
            background: dataParser(ogData.background, newBgs!),
            thirdscreen: dataParser(ogData.thirdscreen, newThird!),
            audio: dataParser(ogData.audio, newAudios!),
            styles: stylesDataParser(newStyles!),
            language: languageParser(newLangs)
        }

        const res = await window.electronAPI.writeJsonData(aux, clientDir, thirdDir, supDir)

        if (res.success) console.log('[APPLY] Custom config file witen')
        else console.error('[APPLY] Custom config file creation failed')

        setLoading(false)
    }

    return (
        <div className={`screen-content main-container ${firstLoad ? 'fade-in' : ''}`}>
            <div>
                <div className="main-header">
                    <h1>Previsualización</h1>
                    <div className="toggler">
                        <div
                            className="input-wrapper"
                            onClick={() => !loading && toggleCustomEnabled()}
                        >
                            Activar Customización
                            <button className={customEnabled ? '' : 'inactive'}>
                                {customEnabled ? <CheckSvg /> : <CancelSvg />}
                            </button>
                        </div>
                    </div>
                </div>

                <AppsVersions />

                <Previewer />

                <div className="actions main-actions">
                    <div className="action">
                        <a
                            onClick={() => !loading && saveConfig()}
                        >
                            Guardar en libreria
                        </a>
                    </div>

                    <div className="action primary">
                        <a onClick={() => !loading && applyConfig()}>Aplicar Customización</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MainScreen
