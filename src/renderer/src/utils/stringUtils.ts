import { WSClientStatus } from '@shared/types'

/** Recibe una fecha en string y retorna en formato DD/MM HH:mm */
export const smallDate = (v: string): string => {
    try {
        const date = new Date(v)
        const d = date.getDate()
        const m = date.getMonth()
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
            'Idle',
            'Operando',
            'Ocupado',
            'Supervisor',
            'OOS',
            'Desactivado',
            'Offline'
        ][v]
    } catch (error) {
        console.error(error)
        return '?'
    }
}

/** Devuelve un estado de terminal legible */
export const terminalLongState = (v: WSClientStatus): string => {
    try {
        return [
            'Idle',
            'Operando',
            'Ejecutando una Tarea',
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
            'terminal-state-operating',
            'terminal-state-runing-task',
            'terminal-state-supervisor',
            'terminal-state-oos',
            'terminal-state-mandatory-oos',
            'terminal-state-offline'
        ][v]
    } catch (error) {
        console.error(error)
        return ''
    }
}
