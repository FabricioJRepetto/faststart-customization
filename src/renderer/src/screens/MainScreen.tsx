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
    DefaultConfigAtom
} from '@renderer/utils/context/context'
import { dataParser, languageParser, stylesDataParser } from '@renderer/utils/assetsUtils'
import { CustomConfig } from '@shared/types'
import { Previewer } from '@renderer/components/Previewer'
import { useState } from 'react'
import CheckSvg from '../assets/check.svg?react'
import CancelSvg from '../assets/cancel.svg?react'
import AppsVersions from '@renderer/components/AppsVersions'

export const MainScreen = (): React.JSX.Element => {
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
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

    const toggleCustomEnabled = async (): Promise<void> => {
        setLoading(true)
        setCustomEnabled(!customEnabled)
        if (defCustomConfig) {
            const aux = { ...defCustomConfig, customEnabled: !customEnabled }
            const res = await window.electronAPI.toggleEnabled(aux, clientDir)
            res.success
                ? console.log('Customs enabled correctly')
                : console.error('Error enabling customs')
        } else {
            console.log('No custom config loaded. Save one first.')
        }
        setLoading(false)
    }

    const testConfig = async (): Promise<void> => {
        setLoading(true)
        const aux: CustomConfig = {
            version: '',
            customEnabled: customEnabled,
            icon: dataParser(ogData.icon, newIcons!),
            background: dataParser(ogData.background, newBgs!),
            thirdscreen: dataParser(ogData.thirdscreen, newThird!),
            audio: dataParser(ogData.audio, newAudios!),
            styles: stylesDataParser(newStyles!),
            language: languageParser(newLangs)
        }

        console.log('[TEST] Testing new config data:\n', aux)
        console.log('[TEST] Destination path for customConfig.json:\n', clientDir)

        const res = await window.electronAPI.writeJsonData(aux, clientDir)

        if (res.success) console.log('[TEST] Custom config file witen')
        else console.error('[TEST] Custom config file creation failed')

        setLoading(false)
    }

    return (
        <div className="screen-content main-container">
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
                        <a style={{ textDecoration: 'line-through' }}>Guardar en libreria</a>
                    </div>

                    <div className="action primary">
                        <a onClick={() => !loading && testConfig()}>Aplicar Customización</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MainScreen
