import { atom, createStore } from 'jotai'
import { AppSettingsData, AssetList, LanguageData, Screens } from '../types'

export const store = createStore()

/** Pantalla actual a renderizar */
export const CurrentScreenAtom = atom<Screens>(Screens.landing)

/** Directorio base de la version de faststart seleccionada */
export const AppVersionDirectoryAtom = atom<string>('')
/** Directorio base de la aplicación. @example 'C:\ncr-cc' */
export const BaseDirectoryAtom = atom<string>('C:\\ncr-cc')

/** Estructura de datos del archivo de idioma por default, se usa para mostrar los campos a editar aunque no tengan valor */
export const LanguageDataStructureAtom = atom<LanguageData>({})
/** Datos del archivo language por default */
export const DefaultLanguageDataAtom = atom<LanguageData>({})
/** Datos del archivo language que se están editando actualmente, se guardan aquí los cambios antes de generar el nuevo archivo */
export const EditedLanguageDataAtom = atom<LanguageData>({})

/** Original TerminalServices appsettings */
export const AppSettingsAtom = atom<AppSettingsData>()
/** Edited TerminalServices appsettings */
export const EditedAppSettingsAtom = atom<AppSettingsData>()

/** Lista de Assets actuales en la versión indicada */
export const AssetsDataAtom = atom<AssetList>()
