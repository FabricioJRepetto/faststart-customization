import { atom, createStore } from 'jotai'
import {
    AppSettingsData,
    AssetData,
    AssetList,
    StylesData,
    LanguageData,
    Screens,
    CustomConfig,
    DefaultStylesData,
    ThemeConfig,
    ThirdScreenConfig,
    DefaultThirdConfigData,
    UPLOAD_STAGE,
    TemplateConfig,
    WSConnectedClient,
    DefaultConfigurations,
    FlowDiagram
} from '@renderer/types/types.d'

export const store = createStore()

export const FirstLoadAtom = atom<boolean>(true)
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

/** Lista de Assets actuales, basado en el template y el tema seleccionado si se está editando uno. */
export const AssetsDataAtom = atom<AssetList>()
/** Archivo template. Contiene una lista de assets utilizados por la app cliente */
export const TemplateConfigAtom = atom<TemplateConfig>()
/** Configuraciones seteadas por defecto (theme, diagram) en el servidor */
export const DefaultConfigurationsAtom = atom<DefaultConfigurations>()

/** Archivo de configuración por defecto encontrado en el directorio de la aplicación cliente */
export const DefaultThemeConfigAtom = atom<CustomConfig>()
/** Archivo de configuración (PARSEADO a TemplateConfig) del tema seleccionado para utilizarse en la edición */
export const ThemeConfigAtom = atom<TemplateConfig>()

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

/** Nuevas Imagenes indicados por el usuario */
export const EditedImagesDataAtom = atom<AssetData[]>()

/** Datos del archivo styles por default */
export const DefaultStylesDataAtom = atom<StylesData>()
/** Nuevos Estilos indicados por el usuario */
export const EditedStylesDataAtom = atom<StylesData>(DefaultStylesData)

/** Nuevos Backgrounds indicados por el usuario */
export const EditedBackgroundsDataAtom = atom<AssetData[]>()

/** Nuenos Backgrounds indicados por el usuario */
export const EditedAudiosDataAtom = atom<AssetData[]>()

/** Nuevos assets para mostrar en la Tercera pantalla indicada por el usuario */
export const EditedThirdScreenAssetsDataAtom = atom<AssetData[]>()
/** Nueva conffig para el carousel de la Tercera pantalla */
export const EditedThirdScreenConfigDataAtom = atom<ThirdScreenConfig>(DefaultThirdConfigData)

/** Lista de temas guardados en el servidor */
export const ThemesLibraryDataAtom = atom<ThemeConfig[]>()

/** Lista de diagramas guardados en el servidor */
export const DiagramsCollectionDataAtom = atom<FlowDiagram[]>()

/** Estado del servidor */
export const ServerStatusAtom = atom<boolean>()

/** Indica si el tema a carga debe setearse como tema default también */
export const UploadSetAsDefaultThemeAtom = atom<boolean>(false)

/** Upload progress */
export const UploadProgressAtom = atom<{
    currentFile: string
    ok: number
    failed: number
    total: number
}>({
    currentFile: '',
    ok: 0,
    failed: 0,
    total: 0
})
/** Upload stage */
export const UploadStageAtom = atom<UPLOAD_STAGE>(UPLOAD_STAGE.NAME)

/** Pantalla activa en la previsualización */
export const PreviewScreenIndexAtom = atom<number>(0)
/** True si se cargó un tema para editar.
 * False si se parte la creación desde cero. */
export const EditingThemeAtom = atom<boolean>(false)

export type svgCacheElement = Record<string, string>
/** Cache para archivos SVG */
export const svgCache = atom<svgCacheElement>({})

/** Estado de conexión al WebSocket */
export const WebSocketStatusAtom = atom<boolean | undefined>(undefined)
/** Lista de estado de Terminales (FastStart - cliente) conectadas */
export const TerminalsStatusAtom = atom<WSConnectedClient[]>([])