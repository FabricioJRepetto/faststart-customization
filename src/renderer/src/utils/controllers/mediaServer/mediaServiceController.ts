import {
    BACKEND_BASE_TEMPLATE_PATH,
    BACKEND_BASE_URL,
    BACKEND_DEFAULT_CONFIG_PATH,
    BACKEND_THEMES_ASSETS_PATH,
    BACKEND_THEMES_CONFIGS_PATH,
    DEFAULT_CONFIG_FILENAME,
    TEMPLATE_CONFIG_FILENAME,
    THEME_CONFIG_FILENAME
} from '@shared/CONSTANTS'
import _TempMediaServer from './_TempMediaServer'
import {
    CustomConfig,
    DBFile,
    DefaultConfigurations,
    DefaultConfigurationsFile,
    MediaServiceBase,
    TemplateRawConfig,
    ThemeConfig,
    UPLOAD_STAGE,
    UploadedFile
} from '@shared/types'
import {
    store,
    UploadProgressAtom,
    UploadSetAsDefaultThemeAtom,
    UploadStageAtom
} from '@renderer/utils/context/context'
import { getMime } from '@renderer/utils/assetsUtils'
import { getUploadList } from '@renderer/utils/getRawConfig'

class MediaService {
    private service: MediaServiceBase = new _TempMediaServer()
    private currentFile: string = ''
    private okUploads: number = 0
    private failedUploads: number = 0
    private totalUploads: number = 0

    private objectToJsonFile(obj: object, filename: string): File {
        const jsonString = JSON.stringify(obj, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        return new File([blob], filename, { type: 'application/json' })
    }

    private updateUploadProgress(): void {
        const aux = {
            currentFile: this.file,
            ok: this.ok,
            failed: this.fail,
            total: this.total
        }
        store.set(UploadProgressAtom, aux)
    }

    private resetUploadProgress(): void {
        this.currentFile = ''
        this.okUploads = 0
        this.failedUploads = 0
        this.totalUploads = 0
        store.set(UploadProgressAtom, { currentFile: '', ok: 0, failed: 0, total: 0 })
        store.set(UploadStageAtom, UPLOAD_STAGE.NAME)
    }

    private simplifyTheme(e: CustomConfig): ThemeConfig {
        try {
            console.log('SimplifyTheme')
            console.log(e)
            const bgPath = e.background.find((e) => e.name === 'background_Idle')!.path
            const logo = e.icon.find((b) => b.name === 'icon_logo')!

            const aux = {
                themeName: e.themeName,
                color: e.styles.userAction,
                background: {
                    base64: bgPath,
                    mime: getMime(bgPath)
                },
                logo: {
                    name: logo.name,
                    base64: logo.path,
                    mime: getMime(logo.path)
                },
                customEnabled: e.customEnabled,
                isActive: e.isActive
            }
            console.log(aux)
            return aux
        } catch (error) {
            console.error(error)
            return {
                themeName: '',
                color: {
                    primaryColor: '',
                    secondaryColor: '',
                    errorMessageColor: ''
                },
                background: {
                    base64: '',
                    mime: ''
                },
                logo: {
                    name: '',
                    base64: '',
                    mime: ''
                },
                customEnabled: false,
                isActive: false
            }
        }
    }

    // private simulateUplaod = async (v: string): Promise<{ path: string }> => {
    //     return await new Promise((r) =>
    //         setTimeout(() => {
    //             r({ path: v + '_testpath.jpg' })
    //         }, 500)
    //     )
    // }

    //? GETTERS / SETTERS

    private get file(): string {
        return this.currentFile
    }
    private get ok(): number {
        return this.okUploads
    }
    private get fail(): number {
        return this.failedUploads
    }
    private get total(): number {
        return this.totalUploads
    }

    private set setFile(v: string) {
        this.currentFile = v
    }
    private set addOk(v: number) {
        this.okUploads += v
    }
    private set addFail(v: number) {
        this.failedUploads += v
    }
    private set setTotalFilesToUpload(v: number) {
        this.totalUploads = v
    }

    //* PUBLICS

    public async getFileList(): Promise<DBFile[]> {
        try {
            const res = await this.service.getFiles()
            if (!res) return []
            return res
        } catch (error) {
            console.error(error)
            return []
        }
    }

    public async getThemes(): Promise<ThemeConfig[]> {
        try {
            store.set(UploadStageAtom, UPLOAD_STAGE.FINISHING)

            const res = await this.service.getThemesList()
            console.log('getThemesList')
            console.log(res)

            if (!res) return []
            return res.map((e) => this.simplifyTheme(e))
        } catch (error) {
            console.error(error)
            return []
        }
    }

    public async getThemeConfig(themeName: string): Promise<CustomConfig | undefined> {
        try {
            store.set(UploadStageAtom, UPLOAD_STAGE.FINISHING)
            const res = await this.service.getThemesList()
            if (!res) return undefined
            const theme = res.find((t) => t.themeName === themeName)
            return theme
        } catch (error) {
            console.error(error)
            return undefined
        }
    }

    public async getTemplateConfigFile(): Promise<TemplateRawConfig | null> {
        try {
            const res = await this.service.getTemplateConfig()
            if (!res) return null
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async getDefaultConfigurations(): Promise<DefaultConfigurations | null> {
        try {
            const res = await this.service.getDefaultConfigs()
            if (!res) return null
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    private async getDefaultConfigurationsFile(): Promise<DefaultConfigurationsFile | null> {
        try {
            const res = await this.service.getDefaultConfigsFile()
            if (!res) return null
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async getDefaultThemeConfigFile(): Promise<CustomConfig | null> {
        try {
            const res = await this.service.getDefaultConfigs()
            if (!res || !res.theme?.data) return null
            return res.theme.data
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async uploadThemeAssets(themeName: string): Promise<UploadedFile[]> {
        this.resetUploadProgress()
        const start = performance.now()

        try {
            const asDefault = store.get(UploadSetAsDefaultThemeAtom)

            store.set(UploadStageAtom, UPLOAD_STAGE.PROCESSING)
            const files = await getUploadList(themeName)
            console.log('Starting Upload for', files.length, 'files...')

            if (!files.length) {
                store.set(UploadStageAtom, UPLOAD_STAGE.NOTHING_TO_DO)
                return []
            }

            this.setTotalFilesToUpload = files.length + (asDefault ? 2 : 1)
            this.updateUploadProgress()
            store.set(UploadStageAtom, UPLOAD_STAGE.UPLOADING)

            const aux: UploadedFile[] = []
            for await (const el of files) {
                this.setFile = el.file.name
                console.log(el.file.name, '-', el.assetName)
                this.updateUploadProgress()

                // TODO - Agregar limpieza de archivos en desuso en el servidor

                const res = await this.service.uploadFile(
                    el.file,
                    `${BACKEND_THEMES_ASSETS_PATH}/${themeName}`,
                    el.file.name
                )

                if (res) {
                    aux.push({
                        assetName: el.assetName,
                        custom: {
                            source: `${BACKEND_BASE_URL}${res.url}`
                        }
                    })
                    this.addOk = 1
                } else {
                    this.addFail = 1
                }
            }
            return aux
        } catch (error) {
            console.error(error)
            store.set(UploadStageAtom, UPLOAD_STAGE.ERROR)
            return []
        } finally {
            console.log(
                'ok:',
                this.ok,
                'fail:',
                this.fail,
                'Upload time',
                Math.round(performance.now() - start),
                'ms'
            )
        }
    }

    public async uploadThemeConfig(
        config: CustomConfig,
        themeName: string
    ): Promise<DBFile | null> {
        try {
            const asDefault = store.get(UploadSetAsDefaultThemeAtom)

            const fileName = `${themeName}${THEME_CONFIG_FILENAME}`
            this.setFile = fileName
            this.updateUploadProgress()

            const jsonFile = this.objectToJsonFile(config, fileName)
            const configRes = await this.service.uploadFile(
                jsonFile,
                BACKEND_THEMES_CONFIGS_PATH,
                fileName
            )

            if (!configRes) {
                this.addFail = 1
                console.error('Error al subir archivo de configuración')

                return null
            }
            this.addOk = 1

            if (asDefault) {
                this.setFile = DEFAULT_CONFIG_FILENAME
                this.updateUploadProgress()

                const oldConfig =
                    (await this.getDefaultConfigurationsFile()) ||
                    ({ diagram: {} } as DefaultConfigurationsFile)
                const newConfig: DefaultConfigurationsFile = {
                    ...oldConfig,
                    theme: { available: true, name: themeName, path: configRes.url }
                }
                const res = await this.uploadDefaultConfig(newConfig, true)
                if (!res) {
                    console.error('Error al definir tema como predeterminado')
                    this.addFail = 1
                } else {
                    this.addOk = 1
                }
            }

            return configRes
        } catch (error) {
            console.error(error)
            this.addFail = 1
            return null
        } finally {
            this.setFile = ''
            this.updateUploadProgress()
        }
    }

    public async uploadTemplateConfig(config: File): Promise<DBFile | null> {
        try {
            const res = await this.service.uploadFile(
                config,
                BACKEND_BASE_TEMPLATE_PATH,
                TEMPLATE_CONFIG_FILENAME
            )

            if (!res) return null
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    uploadDefaultConfig(
        config: DefaultConfigurationsFile,
        convertToFile: true
    ): Promise<DBFile | null>
    uploadDefaultConfig(config: File): Promise<DBFile | null>
    public async uploadDefaultConfig(
        config: File | DefaultConfigurationsFile,
        convertToFile?: boolean
    ): Promise<DBFile | null> {
        try {
            let jsonFile = config as File
            if (convertToFile) {
                jsonFile = this.objectToJsonFile(config, DEFAULT_CONFIG_FILENAME)
            } else {
                //TODO Si es un File checkear estructura
            }
            const res = await this.service.uploadFile(
                jsonFile,
                BACKEND_DEFAULT_CONFIG_PATH,
                DEFAULT_CONFIG_FILENAME
            )

            if (!res) return null
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async toggleCustomization(): Promise<DBFile | null> {
        try {
            const config = await this.getDefaultConfigurationsFile()

            const newConfig =
                config && !config?.error
                    ? { ...config, theme: { ...config.theme, available: !config.theme?.available } }
                    : {
                          theme: { available: false, name: '', path: '' },
                          diagram: null
                      }

            const res = await this.uploadDefaultConfig(newConfig as DefaultConfigurationsFile, true)

            if (!res) {
                console.error('Error al definir tema como predeterminado')
                return null
            }
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async setDefaultTheme(themeName: string): Promise<DBFile | null> {
        try {
            const config = await this.getDefaultConfigurationsFile()

            const baseConfig =
                config && !config?.error
                    ? { ...config }
                    : {
                          theme: { available: false, name: '', path: '' },
                          diagram: null
                      }

            const newConfig: DefaultConfigurationsFile = {
                ...baseConfig,
                theme: {
                    available: true,
                    name: themeName,
                    path: `/files/${BACKEND_THEMES_CONFIGS_PATH}/${themeName}${THEME_CONFIG_FILENAME}` //! CUIDADO HARDCODEADO
                }
            }

            const res = await this.uploadDefaultConfig(newConfig, true)
            if (!res) {
                console.error('Error al establecer configuración como predeterminada')
                return null
            }

            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async deleteTheme(themeName: string): Promise<boolean | null> {
        try {
            const assetsRes = await this.service.delete(
                `${BACKEND_THEMES_ASSETS_PATH}/${themeName}`
            )
            const configRes = await this.service.delete(
                `${BACKEND_THEMES_CONFIGS_PATH}/${themeName}${THEME_CONFIG_FILENAME}`
            )

            if (!assetsRes || !configRes) {
                console.error(
                    `Error al eliminar ${!assetsRes ? 'assets' : ''}${!assetsRes && !configRes ? ' y ' : ''}${!configRes ? 'archivo de configuración' : ''} del tema ${themeName}`
                )
                return false
            }

            const config = await this.service.getDefaultConfigsFile()
            if (!config) return true

            if (config.theme?.name === themeName) {
                const newConfig = {...config, theme: null}
                const res = await this.uploadDefaultConfig(newConfig, true)
                if (!res) console.warn('Error al actualizar configuraciones por defecto');
            }

            return true
        } catch (error) {
            console.error(error)
            return null
        }
    }
}

export default new MediaService()
