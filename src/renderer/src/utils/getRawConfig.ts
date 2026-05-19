import { CustomConfig } from '@shared/types'
import {
    AssetsDataAtom,
    CustomEnabledAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedStylesDataAtom,
    store
} from './context/context'
import { dataParser, languageParser, thirdDataParser, stylesDataParser } from './assetsUtils'

export const getRawConfig = (themeName?: string): CustomConfig => {
    const customEnabled = store.get(CustomEnabledAtom)

    const ogData = store.get(AssetsDataAtom)!

    const newIcons = store.get(EditedIconsDataAtom)
    const newBgs = store.get(EditedBackgroundsDataAtom)

    const newAudios = store.get(EditedAudiosDataAtom)
    const newStyles = store.get(EditedStylesDataAtom)
    const newLangs = store.get(EditedLanguageDataAtom)

    return {
        version: '2.0.1',
        themeName: themeName ?? '',
        ID: new Date().getTime().toString(),
        customEnabled: customEnabled,
        icon: dataParser(ogData.icon, newIcons!),
        background: dataParser(ogData.background, newBgs!),
        thirdscreen: thirdDataParser(),
        audio: dataParser(ogData.audio, newAudios!),
        styles: stylesDataParser(newStyles!),
        language: languageParser(newLangs)
    }
}
