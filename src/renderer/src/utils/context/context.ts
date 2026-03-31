import { atom, createStore } from 'jotai'
import {
    AppSettingsData,
    AssetData,
    AssetList,
    ColorsData,
    DefaultColorsData,
    LanguageData,
    Screens
} from '../types'

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

/** Lista de Assets actuales en la versión indicada */
export const AssetsDataAtom = atom<AssetList>()

/** Datos del archivo language por default */
export const DefaultLanguageDataAtom = atom<LanguageData>({})
/** Datos del archivo language que se están editando actualmente, se guardan aquí los cambios antes de generar el nuevo archivo */
export const EditedLanguageDataAtom = atom<LanguageData>({})

/** Original TerminalServices appsettings */
export const AppSettingsAtom = atom<AppSettingsData>()
/** Edited TerminalServices appsettings */
export const EditedAppSettingsAtom = atom<AppSettingsData>()

/** Nuenos Iconos indicados por el usuario */
export const EditedIconsDataAtom = atom<AssetData[]>()

/** Nuenos Colores indicados por el usuario */
export const EditedColorsDataAtom = atom<ColorsData>(DefaultColorsData)
