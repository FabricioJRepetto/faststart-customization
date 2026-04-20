import { useAtomValue } from 'jotai'
import Video from '../assets/cmofmwygunmg1.mp4'
import {
    ClientAppVersionDirAtom,
    DefaultLanguageDataAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedStylesDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedThirdScreenDataAtom,
    store,
    ThirdAppVersionDirAtom
} from '@renderer/utils/context/context'
import {
    AssetData,
    StylesData,
    CustomConfig,
    FinalAssetData,
    LanguageData
} from '@renderer/utils/types'
import { getStylesData } from '@renderer/utils/appSettings.utils'
import { langDataFullStructure } from '@renderer/utils/LangStructureBuilder'
import { assetExtention } from '@renderer/utils/assetsUtils'

export const MainScreen = (): React.JSX.Element => {
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const thirdDir = useAtomValue(ThirdAppVersionDirAtom)

    const newIcons = useAtomValue(EditedIconsDataAtom)
    const newBgs = useAtomValue(EditedBackgroundsDataAtom)
    const newThird = useAtomValue(EditedThirdScreenDataAtom)
    const newAudios = useAtomValue(EditedAudiosDataAtom)
    const newColors = useAtomValue(EditedStylesDataAtom)
    const newLangs = useAtomValue(EditedLanguageDataAtom)

    const dataParser = (newDataList: AssetData[]): FinalAssetData[] => {
        return newDataList.map((e) => ({
            name: e.name,
            original: { path: e.filePath, fileType: assetExtention(e.filePath) },
            custom: e.customPath
                ? { path: e.customPath, fileType: assetExtention(e.filePath) }
                : undefined
        }))
    }

    const colorDataParser = (newList: StylesData): FinalAssetData[] => {
        const ogColors = Object.entries(getStylesData())
        console.log(newList)

        return ogColors.map(([k, v]) => ({
            name: k,
            original: v,
            custom: newList[k] || ''
        }))
    }

    const languageParser = (newLang: LanguageData): LanguageData => {
        const ogLang = store.get(DefaultLanguageDataAtom)
        const aux = langDataFullStructure(ogLang)
        const langKeys = Object.keys(aux)
        const textKeys = Object.keys(aux[langKeys[0]])

        textKeys.map((text) => {
            langKeys.map((lang) => {
                //: usar operador (??) o (||) ?
                aux[lang][text] = newLang[lang][text] ?? ogLang[lang][text]
            })
        })

        return aux
    }

    const testConfig = async (): Promise<void> => {
        const aux: CustomConfig = {
            icon: dataParser(newIcons!),
            color: colorDataParser(newColors),
            background: dataParser(newBgs!),
            thirdscreen: dataParser(newThird!),
            audio: dataParser(newAudios!),
            language: languageParser(newLangs)
        }

        console.log('[TEST] Testing new config data:\n', aux)
        console.log('[TEST] Destination path for customConfig.json:\n', clientDir)

        const res = await window.electronAPI.writeJsonData(aux, clientDir, thirdDir)

        if (res.success) console.log('[TEST] Custom config file witen')
        else console.error('[TEST] Custom config file creation failed')
    }

    return (
        <div className="screen-content">
            <div className="scree-header">
                <h1>hola con todo respeto</h1>
            </div>
            <video src={Video} muted autoPlay loop></video>

            <div className="actions">
                <div className="action">
                    <a onClick={testConfig}>test new config</a>
                </div>
            </div>
        </div>
    )
}
export default MainScreen
