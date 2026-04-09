import { APPSETTINGS_CONFIGURATION_MODULE } from './CONSTANTS'
import { AppSettingsAtom, store } from './context/context'
import { ColorsData, ConfigContextData } from './types'

/** Retorna todos los datos seteados en el appSettings deTerminalServices */
export const getConfigData = (): ConfigContextData | undefined => {
    try {
        const appsettings = store.get(AppSettingsAtom)

        if (!appsettings) {
            console.error('AppSettings not found in store')
            return
        }

        return appsettings?.Modules.find((e) => e.Assembly === APPSETTINGS_CONFIGURATION_MODULE)
            ?.Options?.Contexts[0].Data
    } catch (error) {
        console.error('getConfigData', error)
        return
    }
}

/** Retorna los datos de colores seteados en el appSettings deTerminalServices */
export const getColorData = (): ColorsData => {
    const defaultData = {
        primaryColor: '',
        secondaryColor: '',
        errorMessageColor: ''
    }

    try {
        // TODO cambiar esto, no debe usar el appSettings
        const configData = getConfigData()
        if (!configData) return defaultData

        return {
            primaryColor: configData?.PrimaryColor?.Value || '',
            secondaryColor: configData?.SecondaryColor?.Value || '',
            errorMessageColor: configData?.ErrorMessageColor?.Value || ''
        }
    } catch (error) {
        console.error('getColorData', error)
        return defaultData
    }
}
