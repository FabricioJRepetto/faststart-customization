import { store, ThemesLibraryDataAtom } from "./context/context"

/** Comprueba que el nomrbe del tema sea válido */
export const test = (themeName: string): boolean => {
    return /^[a-z0-9]+[a-z0-9_.-]*$/gi.test(themeName)
}

export const unicName = (themeName: string): boolean => {
    const themes = store.get(ThemesLibraryDataAtom)
    return !themes?.map((t) => t.themeName.toLowerCase()).includes(themeName.toLowerCase())
}
