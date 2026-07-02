import {
    DefaultStylesData,
    DefaultThirdConfigData,
    DistributionMethod,
    Screens,
    UPLOAD_STAGE
} from '@shared/types'
import {
    ClientAppVersionDirAtom,
    CurrentScreenAtom,
    DefaultConfigAtom,
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    DistributionMethodAtom,
    EditedAudiosDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
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
    ThemesLibraryDataAtom,
    ThirdAppVersionDirAtom,
    UploadProgressAtom,
    UploadSetAsDefaultThemeAtom,
    UploadStageAtom
} from './context/context'
import { clearMediaCache } from './AssetsPreLoader'

/** Resetea todos los valores del contexto */
export const reset = (): void => {
    //_ App
    store.set(FirstLoadAtom, false)
    store.set(DistributionMethodAtom, undefined)
    store.set(PreviewScreenIndexAtom, 0)
    store.set(svgCache, {})

    const isRemote = store.get(DistributionMethodAtom) === DistributionMethod.REMOTE
    if (isRemote) clearMediaCache()

    //_ Data
    store.set(DefaultConfigAtom, undefined)
    store.set(ThemesLibraryDataAtom, undefined)

    store.set(DefaultLanguageDataAtom, {})
    store.set(EditedLanguageDataAtom, {})

    store.set(DefaultStylesDataAtom, undefined)
    store.set(EditedStylesDataAtom, DefaultStylesData)

    store.set(EditedBackgroundsDataAtom, undefined)
    store.set(EditedIconsDataAtom, undefined)
    store.set(EditedAudiosDataAtom, undefined)

    store.set(EditedThirdScreenAssetsDataAtom, undefined)
    store.set(EditedThirdScreenConfigDataAtom, DefaultThirdConfigData)

    //_ Local
    store.set(RootDirectoryAtom, 'C:\\ncr-cc')
    store.set(ClientAppVersionDirAtom, '')
    store.set(SupervisorAppVersionDirAtom, '')
    store.set(ThirdAppVersionDirAtom, '')

    //_ Remoto
    store.set(UploadProgressAtom, { ok: 0, failed: 0, total: 0, currentFile: '' })
    store.set(UploadStageAtom, UPLOAD_STAGE.NAME)
    store.set(ServerStatusAtom, undefined)
    store.set(UploadSetAsDefaultThemeAtom, false)

    //_ Finish >>
    store.set(CurrentScreenAtom, Screens.landing)
}

/** Limpia media cache y Resetea Data: DefaultConfig, Language (Og+Edit), Styles (Og+Edit), Backgrounds, Icons, Audios, Third (Config+Assets) */
export const softReset = (): void => {
    const isRemote = store.get(DistributionMethodAtom) === DistributionMethod.REMOTE
    if (isRemote) clearMediaCache()

    store.set(DefaultConfigAtom, undefined)

    store.set(DefaultLanguageDataAtom, {})
    store.set(EditedLanguageDataAtom, {})

    store.set(DefaultStylesDataAtom, undefined)
    store.set(EditedStylesDataAtom, DefaultStylesData)

    store.set(EditedBackgroundsDataAtom, undefined)
    store.set(EditedIconsDataAtom, undefined)
    store.set(EditedAudiosDataAtom, undefined)

    store.set(EditedThirdScreenAssetsDataAtom, undefined)
    store.set(EditedThirdScreenConfigDataAtom, DefaultThirdConfigData)
}
