import { LanguageData } from '@shared/types'

/** Retorna un objeto con las keys de idioma del objeto languages vacias */
export const langDataShell = (langData: LanguageData): LanguageData => {
    try {
        const unIdioma = Object.keys(langData)[0]
        return objectFullStructure<LanguageData>(langData[unIdioma])
    } catch (error) {
        console.error('Error building language data structure:', error)
        return {}
    }
}

/** Retorna la estructura completa de un objeto con todas las keys vacias (""). */
export function objectFullStructure<T>(langData: object): T {
    try {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const deep = (v) => {
            if (typeof v !== 'object') {
                return ''
            } else {
                const aux = {}
                const keys = Object.keys(v)
                keys.forEach((k) => {
                    aux[k] = deep(v[k])
                })
                return aux
            }
        }

        return deep(langData) as T
    } catch (error) {
        console.error('Error building full language data structure:', error)
        return {} as T
    }
}
