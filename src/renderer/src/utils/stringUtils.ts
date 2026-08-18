import { WSClientStatus } from '@renderer/types/types.d'

/** Recibe una fecha en string y retorna en formato DD/MM HH:mm */
export const smallDate = (v: string): string => {
    try {
        const date = new Date(v)
        const d = date.getDate()
        const m = date.getMonth() + 1
        const hr = date.getHours().toString().padStart(2, '0')
        const mn = date.getMinutes().toString().padStart(2, '0')

        return `${d}/${m} ${hr}:${mn}`
    } catch (error) {
        console.error(error)
        return '?'
    }
}

/** Devuelve un estado de terminal legible */
export const terminalSmallState = (v: WSClientStatus): string => {
    try {
        return [
            'Online',
            'Idle',
            'Operando',
            'Ejecutando',
            'Supervisor',
            'OOS',
            'Desactivado',
            'Offline',
        ][v] ?? '?'
    } catch (error) {
        console.error(error)
        return '?'
    }
}

/** Devuelve un estado de terminal legible */
export const terminalLongState = (v: WSClientStatus): string => {
    try {
        return [
            'Online',
            'Idle',
            'Operando',
            'Ejecutando Tarea',
            'En Supervisor',
            'Fuera de servicio',
            'Fuera de servicio Mandatorio',
            'Offline'
        ][v]
    } catch (error) {
        console.error(error)
        return '?'
    }
}

/** Devuelve la clase asignada a un estado de terminal */
export const stateStyle = (v: WSClientStatus): string => {
    try {
        return [
            'terminal-state-idle',
            'terminal-state-idle',
            'terminal-state-operating',
            'terminal-state-runing-task',
            'terminal-state-supervisor',
            'terminal-state-oos',
            'terminal-state-mandatory-oos',
            'terminal-state-offline'
        ][v] ?? ''
    } catch (error) {
        console.error(error)
        return ''
    }
}
