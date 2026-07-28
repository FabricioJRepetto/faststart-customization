import { CustomConfig, FileForUpload, UploadedFile } from '@shared/types'
import {
    AssetsDataAtom,
    DefaultConfigAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedImagesDataAtom,
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
import { getID } from './IdGen'

/** Genera una lista FileForUpload combinando los assets originales y los modificados */
export const getUploadList = async (): Promise<FileForUpload[]> => {
    try {
        console.log('Starting File conversion...')

        const ogData = store.get(AssetsDataAtom)!
        const ThemeConfig = store.get(DefaultConfigAtom)

        const newIcons = store.get(EditedIconsDataAtom)
        const newImages = store.get(EditedImagesDataAtom)
        const newBgs = store.get(EditedBackgroundsDataAtom)
        const newAudios = store.get(EditedAudiosDataAtom)
        const newThirds = store.get(EditedThirdScreenAssetsDataAtom)

        const iconsList = await assetsToFiles(ogData.icon, newIcons!, ThemeConfig?.icon)
        console.log(iconsList.length, 'icons converted')
        const imagesList = await assetsToFiles(ogData.image, newImages!, ThemeConfig?.image)
        console.log(imagesList.length, 'images converted')
        const bgsList = await assetsToFiles(ogData.background, newBgs!, ThemeConfig?.background)
        console.log(bgsList.length, 'backgrounds converted')
        const audiosList = await assetsToFiles(ogData.audio, newAudios!, ThemeConfig?.audio)
        console.log(audiosList.length, 'audios converted')
        const thirdList = await thirdAssetsToFiles(newThirds!)
        console.log(thirdList.length, 'third screen assets converted')

        const aux: FileForUpload[] = [
            ...iconsList,
            ...imagesList,
            ...bgsList,
            ...audiosList,
            ...thirdList
        ]
        if (!aux.length) console.log('No need to upload new files')
        else console.log(aux.length, 'files ready for upload')

        console.log(aux)

        return aux
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getThemeConfig = (files: UploadedFile[], themeName: string): CustomConfig => {
    try {
        const ogConfig = store.get(DefaultConfigAtom)
        const ogData = store.get(AssetsDataAtom)!
        const asDefault = store.get(UploadSetAsDefaultThemeAtom)

        console.log('getThemeConfig')
        console.log(ogConfig)
        console.log(ogData)

        return {
            version: CUSTOM_FILE_VERSION,
            themeName: themeName,
            ID: getID(),
            customEnabled: true,
            isDefaultTheme: asDefault,
            isActive: true,
            language: languageParser(),
            styles: stylesDataParser(),
            icon: dataParser(ogData.icon, files, ogConfig?.icon),
            image: dataParser(ogData.image, files, ogConfig?.image),
            background: dataParser(ogData.background, files, ogConfig?.background),
            thirdscreen: thirdDataParser(files),
            audio: dataParser(ogData.audio, files, ogConfig?.audio)
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
