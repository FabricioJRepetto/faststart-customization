import { useAtomValue } from 'jotai'
import Video from '../assets/cmofmwygunmg1.mp4'
import {
    DefaultLanguageDataAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedColorsDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedThirdScreenDataAtom,
    store
} from '@renderer/utils/context/context'
import { AssetData, ColorsData, LanguageData } from '@renderer/utils/types'
import { getColorData } from '@renderer/utils/appSettings.utils'
import { langDataFullStructure } from '@renderer/utils/LangStructureBuilder'

interface FinalAssetData {
    name: string
    custom: string
    original: string
}

export const MainScreen = (): React.JSX.Element => {
    const newIcons = useAtomValue(EditedIconsDataAtom)
    const newBgs = useAtomValue(EditedBackgroundsDataAtom)
    const newThird = useAtomValue(EditedThirdScreenDataAtom)
    const newAudios = useAtomValue(EditedAudiosDataAtom)
    const newColors = useAtomValue(EditedColorsDataAtom)
    const newLangs = useAtomValue(EditedLanguageDataAtom)

    const dataParser = (newDataList: AssetData[]): FinalAssetData[] => {
        return newDataList.map((e) => ({
            name: e.name,
            custom: e.customPath,
            original: e.filePath
        }))
    }

    const colorDataParser = (newList: ColorsData): FinalAssetData[] => {
        const ogColors = Object.entries(getColorData())
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

    const testConfig = (): void => {
        const aux = {
            icon: dataParser(newIcons!),
            color: colorDataParser(newColors),
            background: dataParser(newBgs!),
            thirdscreen: dataParser(newThird!),
            audio: dataParser(newAudios!),
            language: languageParser(newLangs)
        }

        console.log('[TEST] Testing new config data:\n', aux)
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
