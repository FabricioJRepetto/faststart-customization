import { readFileSync, writeFileSync } from 'fs'
import { CustomConfig, IpcResponse } from '../../renderer/src/types/types'
import { CUSTOM_CONFIG_FILE_NAME } from '../../renderer/src/CONSTANTS'
import { join } from 'path'

export const toggleCustomEnabled = async (
    _event,
    data: boolean,
    clientDir: string,
    thirdDir: string,
    supDir: string
): Promise<IpcResponse<number>> => {
    try {
        let success = 0

        if (clientDir) {
            console.log('toggling client')
            toogleProp(clientDir, data) && success++
        }

        if (thirdDir) {
            console.log('toggling third')
            toogleProp(thirdDir, data) && success++
        }

        if (supDir) {
            console.log('toggling sup')
            toogleProp(supDir, data) && success++
        }

        return { success: true, data: success }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}

const toogleProp = (path: string, data: boolean): boolean => {
    try {
        const dir = join(path, CUSTOM_CONFIG_FILE_NAME)

        const stringData = readFileSync(dir, 'utf-8')
        const aux: CustomConfig = JSON.parse(stringData)
        aux.customEnabled = data
        const finalData = JSON.stringify(aux, null, 2)

        writeFileSync(dir, finalData, 'utf-8')
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
