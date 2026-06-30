import { Screens } from '@shared/types'
import { CurrentScreenAtom, store } from './context/context'

export enum SECT {
    logo_style_edit = 'styles-editor-logo-section',
    general_style_edit = 'styles-editor-general-section',
    success_style_edit = 'styles-editor-success-section',
    error_style_edit = 'styles-editor-error-section',
    button_style_edit = 'styles-editor-primary-button-section',
    sec_button_style_edit = 'styles-editor-secondary-button-section',
    input_button_style_edit = 'styles-editor-input-button-section'
}

export const navigate = (screen: Screens, section?: SECT): void => {
    console.log(`Going to: ${screen}${section ? ', section:' + section : ''}`)
    store.set(CurrentScreenAtom, screen)
    if (section) {
        setTimeout(() => {
            const el = document.getElementById(section)
            if (el) el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            })
        }, 300);
    }
}
