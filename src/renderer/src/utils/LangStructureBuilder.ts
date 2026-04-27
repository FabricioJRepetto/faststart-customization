import { LanguageData } from '@shared/types'

/** Retorna la estructura completa del archivo language con todas las keys vacias ("") */
export const langDataFullStructure = (langData: LanguageData): LanguageData => {
    try {
        const langKeys = Object.keys(langData)
        const textKeys = Object.keys(langData[langKeys[0]])

        const auxKeys = {}
        textKeys.forEach((key) => {
            auxKeys[key] = ''
        })
        const aux: Record<string, Record<string, string>> = {}
        langKeys.forEach((key) => {
            aux[key] = { ...auxKeys }
        })

        return aux
    } catch (error) {
        console.error('Error building full language data structure:', error)
        return {}
    }
}

/** Retorna un objeto con las keys de idioma del objeto languages vacias */
export const langDataShell = (langData: LanguageData): LanguageData => {
    try {
        const langKeys = Object.keys(langData)
        const aux: Record<string, Record<string, string>> = {}
        langKeys.forEach((lang) => {
            aux[lang] = {}
        })

        return aux
    } catch (error) {
        console.error('Error building language data structure:', error)
        return {}
    }
}
