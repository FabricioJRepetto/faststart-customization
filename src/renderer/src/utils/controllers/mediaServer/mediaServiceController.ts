import {
    BACKEND_BASE_URL,
    BACKEND_DEFAULT_CONFIG_PATH,
    BACKEND_THEMES_ASSETS_PATH,
    BACKEND_THEMES_CONFIGS_PATH,
    DEFAULT_CONFIG_FILENAME,
    SERVICES_APPSETTINGS_DIR,
    THEME_CONFIG_FILENAME
} from '@shared/CONSTANTS'
import _TempMediaServer from './_TempMediaServer'
import {
    CustomConfig,
    DBFile,
    MediaServiceBase,
    TemplateConfig,
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
            const bgPath = e.background.find((e) => e.name === 'background_Idle')!.path
            const logo = e.icon.find((b) => b.name === 'icon_logo')!
            return {
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
                isActive: e.isActive,
                isDefaultTheme: e.isDefaultTheme
            }
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
                isActive: false,
                isDefaultTheme: false
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

    public async getThemes(): Promise<ThemeConfig[]> {
        try {
            store.set(UploadStageAtom, UPLOAD_STAGE.FINISHING)

            const res = await this.service.getThemesList()
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

    public async getTemplateConfigFile(): Promise<TemplateConfig | null> {
        try {
            const res = await this.service.getTemplateConfig()
            if (!res) return null
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async getDefaultConfigFile(): Promise<CustomConfig | null> {
        try {
            const res = await this.service.getDefaultConfig()
            if (!res) return null
            return res
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
            const files = await getUploadList()
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

                const res = await this.service.uploadFile(
                    el.file,
                    `${BACKEND_THEMES_ASSETS_PATH}/${themeName}`,
                    el.file.name
                )
                // const res = await this.simulateUplaod(themeName)

                if (res) {
                    aux.push({
                        customPath: `${BACKEND_BASE_URL}${res.url}`,
                        name: el.assetName
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
            const res = await this.service.uploadFile(
                jsonFile,
                BACKEND_THEMES_CONFIGS_PATH,
                fileName
            )

            if (!res) {
                this.addFail = 1
                console.error('Error al subir archivo de configuración')

                return null
            }
            this.addOk = 1

            if (asDefault) {
                this.setFile = DEFAULT_CONFIG_FILENAME
                this.updateUploadProgress()

                const res = await this.uploadDefaultConfig(config)
                if (!res) {
                    console.error('Error al setear tema como predeterminado')
                    this.addFail = 1
                } else {
                    this.addOk = 1
                }
            }

            return res as DBFile
        } catch (error) {
            console.error(error)
            this.addFail = 1
            return null
        } finally {
            this.setFile = ''
            this.updateUploadProgress()
        }
    }

    public async uploadDefaultConfig(config: CustomConfig): Promise<DBFile | null> {
        try {
            await SERVICES_APPSETTINGS_DIR
            const jsonFile = this.objectToJsonFile(config, DEFAULT_CONFIG_FILENAME)
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
            const config = await this.getDefaultConfigFile()
            if (!config) return null
            config.customEnabled = !config.customEnabled

            const res = await this.uploadDefaultConfig(config)

            if (!res) return null
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async setDefaultTheme(themeName: string): Promise<DBFile | null> {
        try {
            const theme = await this.getThemeConfig(themeName)
            if (!theme) {
                console.error('Configuración no encontrada')
                return null
            }

            theme.isDefaultTheme = true
            const updateRes = await this.uploadThemeConfig(theme, themeName)
            if (!updateRes) {
                console.error('Error al actualizar configuración')
            }

            const res = await this.uploadDefaultConfig(theme)
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
            return true
        } catch (error) {
            console.error(error)
            return null
        }
    }

    // public async uploadLocalTheme(fileList: {file: File, assetName: string}[], themeName: string): Promise<void> {
    //     try {
    //           const uploadPromises = fileList.map(async ({ file, assetName }) => {
    //               const category = getCategory(file.name)
    //               const assetType = getAssetType(file.name)
    //               const url = await this.service.uploadFile(file, themeName)

    //               return {
    //                   category,
    //                   assetType,
    //                   url,
    //                   assetName
    //               }
    //           })

    //           return Promise.all(uploadPromises)
    //     } catch (error) {
    //         console.error(error)
    //         throw error
    //     }
    // }
}

export default new MediaService()
