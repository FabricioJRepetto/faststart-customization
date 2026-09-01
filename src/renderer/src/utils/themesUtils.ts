import { DiagramsCollectionDataAtom, store, ThemesLibraryDataAtom } from "./context/context"

/** Comprueba que el nomrbe del tema sea válido */
export const validName = (themeName: string): boolean => {
    return /^[a-z0-9]+[a-z0-9_.-]*$/gi.test(themeName)
}

export const unicName = (themeName: string): boolean => {
    const themes = store.get(ThemesLibraryDataAtom)
    return !themes?.map((t) => t.themeName.toLowerCase()).includes(themeName.toLowerCase())
}

const blackList = ['configurations', 'faststart']
export const permittedName = (themeName: string): boolean => {
    return !blackList.includes(themeName.toLowerCase())
}

export const unicDiagramName = (diagramName: string): boolean => {
    const diagrams = store.get(DiagramsCollectionDataAtom)
    return !diagrams?.map((t) => t.name?.toLowerCase()).includes(diagramName.toLowerCase())
}