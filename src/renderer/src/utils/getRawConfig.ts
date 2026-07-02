import { CustomConfig, FileForUpload, UploadedFile } from '@shared/types'
import {
    AssetsDataAtom,
    CustomEnabledAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedThirdScreenAssetsDataAtom,
    store,
    UploadSetAsDefaultThemeAtom
} from './context/context'
import {
    dataParser,
    languageParser,
    thirdDataParser,
    stylesDataParser,
    assetsToFiles,
    thirdAssetsToFiles
} from './assetsUtils'
import { CUSTOM_FILE_VERSION } from '@shared/CONSTANTS'

/** Genera un CustomConfig combinando los assets originales y los modificados */
export const getRawConfig = (themeName?: string): CustomConfig => {
    const customEnabled = store.get(CustomEnabledAtom)

    const ogData = store.get(AssetsDataAtom)!

    const newIcons = store.get(EditedIconsDataAtom)
    const newBgs = store.get(EditedBackgroundsDataAtom)
    const newAudios = store.get(EditedAudiosDataAtom)

    return {
        version: CUSTOM_FILE_VERSION,
        themeName: themeName ?? '',
        ID: new Date().getTime().toString(),
        customEnabled: customEnabled,
        isActive: true,
        isDefaultTheme: false,
        styles: stylesDataParser(),
        language: languageParser(),
        icon: dataParser(ogData.icon, newIcons!),
        background: dataParser(ogData.background, newBgs!),
        audio: dataParser(ogData.audio, newAudios!),
        thirdscreen: thirdDataParser()
    }
}

/** Genera una lista FileForUpload combinando los assets originales y los modificados */
export const getUploadList = async (): Promise<FileForUpload[]> => {
    try {
        console.log('Starting File conversion...')

        const ogData = store.get(AssetsDataAtom)!

        const newIcons = store.get(EditedIconsDataAtom)
        const newBgs = store.get(EditedBackgroundsDataAtom)
        const newAudios = store.get(EditedAudiosDataAtom)
        const newThirds = store.get(EditedThirdScreenAssetsDataAtom)

        const iconsList = await assetsToFiles(ogData.icon, newIcons!)
        console.log(iconsList.length, 'icons converted')
        const bgsList = await assetsToFiles(ogData.background, newBgs!)
        console.log(bgsList.length, 'backgrounds converted')
        const audiosList = await assetsToFiles(ogData.audio, newAudios!)
        console.log(audiosList.length, 'audios converted')
        const thirdList = await thirdAssetsToFiles(newThirds!)
        console.log(thirdList.length, 'third screen assets converted')

        const aux: FileForUpload[] = [...iconsList, ...bgsList, ...audiosList, ...thirdList]
        if (!aux.length) console.log('No need to upload new files')
        else console.log(aux.length, 'files ready for upload')

        return aux
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getThemeConfig = (files: UploadedFile[], themeName: string): CustomConfig => {
    try {
        const ogData = store.get(AssetsDataAtom)!
        const asDefault = store.get(UploadSetAsDefaultThemeAtom)

        return {
            version: CUSTOM_FILE_VERSION,
            themeName: themeName,
            ID: new Date().getTime().toString(),
            customEnabled: true,
            isDefaultTheme: asDefault,
            isActive: true,
            language: languageParser(),
            styles: stylesDataParser(),
            icon: dataParser(ogData.icon, files),
            background: dataParser(ogData.background, files),
            thirdscreen: thirdDataParser(files),
            audio: dataParser(ogData.audio, files)
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
