/** Recibe y ejecuta una promesa, asegura que la espera dure minimamente lo indicado en el @param seconds */
export const minimumWait = async <T>(seconds: number, callback: () => Promise<T>): Promise<T> => {
    try {
        const start = performance.now()
        const res = await callback()
        const duration = Math.round(performance.now() - start)
        if (duration <= seconds * 1000) {
            await new Promise((r) => setTimeout(r, seconds * 1000 - duration))
        }
        return res
    } catch (error) {
        console.error(error)
        throw error
    }
}

/** Espera de X milisegundos */
export const delay = async (ms: number): Promise<void> => {
    await new Promise((r) => setTimeout(r, ms))
}