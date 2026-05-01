import { atom, createStore } from 'jotai'
import {
    AppSettingsData,
    AssetData,
    AssetList,
    StylesData,
    LanguageData,
    Screens,
    CustomConfig,
    DefaultStylesData
} from '@shared/types'

export const store = createStore()

/** Pantalla actual a renderizar */
export const CurrentScreenAtom = atom<Screens>(Screens.landing)

/** Directorio base de la aplicación. @example 'C:\ncr-cc' */
export const RootDirectoryAtom = atom<string>('C:\\ncr-cc')
/** Directorio base de la version de Cliente */
export const ClientAppVersionDirAtom = atom<string>('')
/** Directorio base de la version de Supervisor */
export const SupervisorAppVersionDirAtom = atom<string>('')
/** Directorio base de la version de ThirdScreen */
export const ThirdAppVersionDirAtom = atom<string>('')
/** Activar o desactivar la configuración customizada */
export const CustomEnabledAtom = atom<boolean>(true)

/** Lista de Assets actuales en la versión indicada */
export const AssetsDataAtom = atom<AssetList>()
/** Archivo de configuración por defecto encontrado en el directorio de la aplicación cliente */
export const DefaultConfigAtom = atom<CustomConfig>()

/** Datos del archivo language por default */
export const DefaultLanguageDataAtom = atom<LanguageData>({})
/** Datos del archivo language que se están editando actualmente, se guardan aquí los cambios antes de generar el nuevo archivo */
export const EditedLanguageDataAtom = atom<LanguageData>({})

/** @deprecated Original TerminalServices appsettings */
export const AppSettingsAtom = atom<AppSettingsData>()
/** @deprecated Edited TerminalServices appsettings */
export const EditedAppSettingsAtom = atom<AppSettingsData>()

/** Nuevos Iconos indicados por el usuario */
export const EditedIconsDataAtom = atom<AssetData[]>()

/** Datos del archivo styles por default */
export const DefaultStylesDataAtom = atom<StylesData>()
/** Nuevos Estilos indicados por el usuario */
export const EditedStylesDataAtom = atom<StylesData>(DefaultStylesData)

/** Nuevos Backgrounds indicados por el usuario */
export const EditedBackgroundsDataAtom = atom<AssetData[]>()

/** Nueva meda para mostrar en la Tercera pantalla indicada por el usuario */
export const EditedThirdScreenDataAtom = atom<AssetData[]>()

/** Nuenos Backgrounds indicados por el usuario */
export const EditedAudiosDataAtom = atom<AssetData[]>()
