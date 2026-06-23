export const CUSTOM_FILE_VERSION = '2.0.2'
/** Directorio de assets por defecto */
export const VERSIONS_DIR = `/TerminalAgent/static/`
/** Directorio de assets por defecto */
export const CUSTOMS_FOLDER_NAME = `customs`
/** Directorio de assets por defecto */
export const DEFAULT_ASSETS_DIR = `customs`
/** Nombre de carpeta temporal (usada para copiar archivos) */
export const TEMP_FOLDER = 'temp'
/** Inicia con el directorio de la version */
export const DEFAULT_LANGUAGE_DATA_DIR = `/${DEFAULT_ASSETS_DIR}/languages.json`
/** Inicia con el directorio de la version */
export const DEFAULT_STYLES_DATA_DIR = `/${DEFAULT_ASSETS_DIR}/styles.json`
/** Inicia con el directorio base */
export const SERVICES_APPSETTINGS_DIR = `/TerminalServices/appsettings.json`
/** Modulo del appsettings que contiene la confguración de estilos */
export const APPSETTINGS_CONFIGURATION_MODULE = `TerminalServices.Services.ConfigurationSettings.dll`
/** Nombre del archivo final de configuracion */
export const CUSTOM_CONFIG_FILE_NAME = 'customConfig.json'
/** Nombre del directorio libreria de temas */
export const THEMES_LIBRARY_DIR = 'library'

export const DEFAULT_THEME = 'FastStart'

export const BACKEND_BASE_URL = 'https://153.81.238.232:4005'
export const BACKEND_GET_FILELIST = `${BACKEND_BASE_URL}/files-list`
export const BACKEND_GET_FILE = `${BACKEND_BASE_URL}/files`
export const BACKEND_POST_UPLOAD = `${BACKEND_BASE_URL}/upload`
export const BACKEND_DELETE = `${BACKEND_BASE_URL}/files`
export const BACKEND_THEMES_ASSETS_PATH = `themes/assets`
export const BACKEND_THEMES_CONFIGS_PATH = `themes/configurations`
export const BACKEND_BASE_THEME_CONFIG_PATH = `base_theme/configuration`
export const BACKEND_BASE_THEME_ASSETS_PATH = `base_theme/assets`
export const BACKEND_DEFAULT_CONFIG_PATH = `default/configuration`
export const DEFAULT_CONFIG_FILENAME = CUSTOM_CONFIG_FILE_NAME
export const THEME_CONFIG_FILENAME = '_themeConfig.json'