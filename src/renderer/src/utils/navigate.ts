import { Screens } from '@shared/types'
import { CurrentScreenAtom, store } from './context/context'
import { delay } from './delays'

export enum SECT {
    logo_style_edit = 'styles-editor-logo-section',
    idle_style_edit = 'styles-editor-idle-section',
    user_action_style_edit = 'styles-editor-user_action-section',
    info_style_edit = 'styles-editor-info-section',
    success_style_edit = 'styles-editor-success-section',
    error_style_edit = 'styles-editor-error-section',
    button_style_edit = 'styles-editor-primary-button-section',
    sec_button_style_edit = 'styles-editor-secondary-button-section',
    input_button_style_edit = 'styles-editor-input-button-section'
}
const scrollConfig: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
}
export const navigate = (screen: Screens, section?: SECT): void => {
    //TODO agregar section > language key, icons
    console.log(`Going to: ${screen}${section ? ', section:' + section : ''}`)
    store.set(CurrentScreenAtom, screen)
    if (!section) return
    ;(async () => {
        await delay(300)
        const el = document.getElementById(section)
        if (!el) return
        el.scrollIntoView(scrollConfig)
        await delay(300)
        el.classList.add('flash-highlight')
        await delay(2000)
        el.classList.remove('flash-highlight')
    })()
}
