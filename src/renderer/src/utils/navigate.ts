import { Screens } from '@shared/types'
import { CurrentScreenAtom, store } from './context/context'

export const navigate = (screen: Screens, section?: string): void => {
    console.log(`Going to: ${screen}${section ? ', section:' + section : ''}`)
    store.set(CurrentScreenAtom, screen)
}
