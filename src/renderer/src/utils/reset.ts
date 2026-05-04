import { Screens } from '@shared/types'
import {
    ClientAppVersionDirAtom,
    CurrentScreenAtom,
    FirstLoadAtom,
    store,
    SupervisorAppVersionDirAtom,
    ThirdAppVersionDirAtom
} from './context/context'

/** Resetea valores del contexto */
export const reset = (): void => {
    store.set(ClientAppVersionDirAtom, '')
    store.set(SupervisorAppVersionDirAtom, '')
    store.set(ThirdAppVersionDirAtom, '')
    store.set(FirstLoadAtom, false)
    store.set(CurrentScreenAtom, Screens.landing)
}
