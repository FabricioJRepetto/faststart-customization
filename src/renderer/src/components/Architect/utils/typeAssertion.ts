/** Se asegura que el array recibido contenga TODAS las keys del Type, Objeto o Interface indicado.
 * Para tipos: indicar el type directamente.
 * @example allKeysOf<MyType>()(['a', 'b', 'c'])
 * 
 * Para Interfaces: indicar la interface con keyof.
 * @example allKeysOf<keyof MyInterface>()(['a', 'b', 'c'])
 */
export function allKeysOf<T extends string | number | symbol>() {
    return function <U extends readonly T[]>(
        array: U &
            (Exclude<T, U[number]> extends never
                ? unknown
                : `Faltan valores: ${Exclude<T, U[number]> & string}`)
    ) {
        return array
    }
}
