import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs'
import { CustomConfig, IpcResponse, ThemeConfig } from '../../../shared/types'
import { getBase64, libraryDir } from '../utils'
import { join } from 'path'
import { CUSTOM_CONFIG_FILE_NAME } from '../../../shared/CONSTANTS'

export const getLibraryThemesList = async (): Promise<IpcResponse<ThemeConfig[]>> => {
    try {
        if (!existsSync(libraryDir)) {
            mkdirSync(libraryDir)
            return { success: false, error: "Directory didn't exists" }
        }
        const aux = readdirSync(libraryDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((e) => {
                console.log(join(libraryDir, e.name, CUSTOM_CONFIG_FILE_NAME))
                const file = readFileSync(
                    join(libraryDir, e.name, CUSTOM_CONFIG_FILE_NAME),
                    'utf-8'
                )
                const config = JSON.parse(file) as CustomConfig
                const themeName = config.themeName
                const color = config.styles.userAction
                const background = getBase64(
                    join(
                        libraryDir,
                        e.name,
                        config.background.find((b) => b.name === 'background_Idle')!.path
                    )
                )
                const logo = getBase64(
                    join(libraryDir, e.name, config.icon.find((b) => b.name === 'icon_logo')!.path)
                )
                const customEnabled = config.customEnabled
                const isActive = config?.isActive ?? false
                const isDefaultTheme = config?.isDefaultTheme ?? false

                return {
                    themeName,
                    color,
                    background,
                    logo,
                    customEnabled,
                    isActive,
                    isDefaultTheme
                }
            })
        return { success: true, data: aux }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}
