/** Se asegura que el array recibido contenga TODAS las keys del Tipo indicado */
export function allKeysOf<T>() {
    return function <U extends (keyof T)[]>(
        array: U &
            (Exclude<keyof T, U[number]> extends never
                ? unknown
                : `Faltan keys: ${Exclude<keyof T, U[number]> & string}`)
    ) {
        return array
    }
}
