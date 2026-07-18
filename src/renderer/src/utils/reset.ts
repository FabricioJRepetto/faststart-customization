import { DefaultStylesData, DefaultThirdConfigData, Screens, UPLOAD_STAGE } from '@shared/types'
import {
    ClientAppVersionDirAtom,
    CurrentScreenAtom,
    DefaultConfigAtom,
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedImagesDataAtom,
    EditedLanguageDataAtom,
    EditedStylesDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom,
    FirstLoadAtom,
    PreviewScreenIndexAtom,
    RootDirectoryAtom,
    ServerStatusAtom,
    store,
    SupervisorAppVersionDirAtom,
    svgCache,
    TemplateConfigAtom,
    TerminalsStatusAtom,
    ThemesLibraryDataAtom,
    ThirdAppVersionDirAtom,
    UploadProgressAtom,
    UploadSetAsDefaultThemeAtom,
    UploadStageAtom,
    WebSocketStatusAtom
} from './context/context'
import { clearMediaCache } from './AssetsPreLoader'
import WSService from './controllers/WebSocketService/WebSocketServiceController'

/** Resetea todos los valores del contexto */
export const reset = (): void => {
    //_ App
    store.set(FirstLoadAtom, true)
    store.set(PreviewScreenIndexAtom, 0)
    store.set(svgCache, {})

    clearMediaCache()

    //_ Data
    store.set(TemplateConfigAtom, undefined)
    store.set(DefaultConfigAtom, undefined)
    store.set(ThemesLibraryDataAtom, undefined)

    store.set(DefaultLanguageDataAtom, {})
    store.set(EditedLanguageDataAtom, {})

    store.set(DefaultStylesDataAtom, undefined)
    store.set(EditedStylesDataAtom, DefaultStylesData)

    store.set(EditedBackgroundsDataAtom, undefined)
    store.set(EditedIconsDataAtom, undefined)
    store.set(EditedImagesDataAtom, undefined)
    store.set(EditedAudiosDataAtom, undefined)

    store.set(EditedThirdScreenAssetsDataAtom, undefined)
    store.set(EditedThirdScreenConfigDataAtom, DefaultThirdConfigData)

    //_ Local
    store.set(RootDirectoryAtom, 'C:\\ncr-cc')
    store.set(ClientAppVersionDirAtom, '')
    store.set(SupervisorAppVersionDirAtom, '')
    store.set(ThirdAppVersionDirAtom, '')

    //_ Remoto
    WSService.close()
    store.set(WebSocketStatusAtom, undefined)
    store.set(UploadProgressAtom, { ok: 0, failed: 0, total: 0, currentFile: '' })
    store.set(UploadStageAtom, UPLOAD_STAGE.NAME)
    store.set(ServerStatusAtom, undefined)
    store.set(UploadSetAsDefaultThemeAtom, false)
    store.set(TerminalsStatusAtom, [])

    //_ Finish >>
    store.set(CurrentScreenAtom, Screens.landing)
}

/** Limpia media cache y Resetea Data: DefaultConfig, Language (Og+Edit), Styles (Og+Edit), Backgrounds, Icons, Audios, Third (Config+Assets) */
export const softReset = (): void => {
    clearMediaCache()

    store.set(DefaultConfigAtom, undefined)

    store.set(DefaultLanguageDataAtom, {})
    store.set(EditedLanguageDataAtom, {})

    store.set(DefaultStylesDataAtom, undefined)
    store.set(EditedStylesDataAtom, DefaultStylesData)

    store.set(EditedBackgroundsDataAtom, undefined)
    store.set(EditedIconsDataAtom, undefined)
    store.set(EditedImagesDataAtom, undefined)
    store.set(EditedAudiosDataAtom, undefined)

    store.set(EditedThirdScreenAssetsDataAtom, undefined)
    store.set(EditedThirdScreenConfigDataAtom, DefaultThirdConfigData)

    store.set(TerminalsStatusAtom, [])
}

/** Limpia media cache y Resetea Data: DefaultConfig, Language (Og+Edit), Styles (Og+Edit), Backgrounds, Icons, Audios, Third (Config+Assets) */
export const resetEditions = (): void => {
    clearMediaCache()

    store.set(DefaultConfigAtom, undefined)

    const config = store.get(TemplateConfigAtom)!

    store.set(EditedIconsDataAtom, [...config.icon])
    store.set(EditedImagesDataAtom, [...config.image])
    store.set(EditedBackgroundsDataAtom, [...config.background])
    store.set(EditedAudiosDataAtom, [...config.audio])
    store.set(EditedThirdScreenAssetsDataAtom, [])

    store.set(EditedThirdScreenConfigDataAtom, DefaultThirdConfigData)
}
