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

export const MainScreen = (): React.JSX.Element => {
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    // const thirdDir = useAtomValue(ThirdAppVersionDirAtom)
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
            <div className="scree-header">
                <h1>Preview</h1>
                <Previewer />
            </div>

            <div className="actions">
                <div className={`action ${customEnabled ? 'green' : 'red'}`}>
                    <a
                        onClick={() => {
                            if (!loading) toggleCustomEnabled()
                        }}
                    >
                        Activar Customización
                    </a>
                </div>
                <div className="action">
                    <a>Guardar en libreria</a>
                </div>

                <div className="action primary">
                    <a
                        onClick={() => {
                            if (!loading) testConfig()
                        }}
                    >
                        Aplicar Customización
                    </a>
                </div>
            </div>
        </div>
    )
}
export default MainScreen
