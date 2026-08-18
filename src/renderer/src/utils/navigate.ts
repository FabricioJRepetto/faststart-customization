import { Screens } from '@renderer/types/types.d'
import { CurrentScreenAtom, store } from './context/context'
import { delay } from './delays'

export const scrollConfig: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
}

/** Sección, argumento para la función navigate */
export enum STYLES {
    logo = 'styles-editor-logo-section',
    idle = 'styles-editor-idle-section',
    user_action = 'styles-editor-user_action-section',
    info = 'styles-editor-info-section',
    success = 'styles-editor-success-section',
    error = 'styles-editor-error-section',
    button = 'styles-editor-primary-button-section',
    sec_button = 'styles-editor-secondary-button-section',
    input_button = 'styles-editor-input-button-section'
}
/** Sección, argumento para la función navigate */
export enum BACKGROUNDS {
    idle = 'backgrounds-editor-background_idle',
    user_action = 'backgrounds-editor-background_useraction',
    info = 'backgrounds-editor-background_info',
    success = 'backgrounds-editor-background_success',
    error = 'backgrounds-editor-background_error',
    oos = 'backgrounds-editor-background_oos',
    supervisor = 'backgrounds-editor-background_supervisor'
}
/** Sección, argumento para la función navigate */
export enum IMAGES {
    error = 'images-editor-image_error',
    insert_bills = 'images-editor-image_insert_bills',
    oos = 'images-editor-image_oos',
    success = 'images-editor-image_success',
    take_bills = 'images-editor-image_take_bills',
    thankyou = 'images-editor-image_thankyou',
    wait = 'images-editor-image_wait',
    warning = 'images-editor-image_warning'
}
/** Sección, argumento para la función navigate */
export enum ICONS {
    bills = 'icons-editor-icon_bills',
    button_confirm = 'icons-editor-icon_button_confirm',
    button_continue = 'icons-editor-icon_button_continue',
    button_exit = 'icons-editor-icon_button_exit',
    exchange = 'icons-editor-icon_exchange',
    left_arrow = 'icons-editor-icon_left_arrow',
    logo = 'icons-editor-icon_logo',
    qr_logo = 'icons-editor-icon_qr_logo',
    return = 'icons-editor-icon_return',
    right_arrow = 'icons-editor-icon_right_arrow',
    world = 'icons-editor-icon_world'
}
enum general {
    button_exit = 'language-editor-general-button_exit',
    button_confirm = 'language-editor-general-button_confirm',
    executingTransaction = 'language-editor-general-executingTransaction',
    clear = 'language-editor-general-clear',
    printTitle = 'language-editor-general-printTitle',
    printSubtitle = 'language-editor-general-printSubtitle',
    menuTitle = 'language-editor-general-menuTitle'
}
enum idle {
    button_start = 'language-editor-idle-button_start'
}
enum info {
    oos = 'language-editor-info-oos',
    wait = 'language-editor-info-wait',
    thankYou = 'language-editor-info-thankYou',
    errorTitle = 'language-editor-info-errorTitle',
    moneyRetracted = 'language-editor-info-moneyRetracted',
    contactSupport = 'language-editor-info-contactSupport',
    welcomeUser = 'language-editor-info-welcomeUser'
}
enum dispense {
    takeMoney = 'language-editor-dispense-takeMoney',
    enterAmount = 'language-editor-dispense-enterAmount',
    scanQR = 'language-editor-dispense-scanQR',
    withdrawalOf = 'language-editor-dispense-withdrawalOf',
    notEnoughBillsErrorMessage = 'language-editor-dispense-notEnoughBillsErrorMessage',
    amountNotPossibleErrorMessage = 'language-editor-dispense-amountNotPossibleErrorMessage',
    recommendedAmount = 'language-editor-dispense-recommendedAmount',
    withdrawOption = 'language-editor-dispense-withdrawOption',
    withdrawARS = 'language-editor-dispense-withdrawARS',
    withdrawUSD = 'language-editor-dispense-withdrawUSD'
}
enum exchange {
    takeMoney = 'language-editor-exchange-takeMoney',
    enterAmount = 'language-editor-exchange-enterAmount',
    insertMoney = 'language-editor-exchange-insertMoney',
    executingTransaction = 'language-editor-exchange-executingTransaction',
    scanQR = 'language-editor-exchange-scanQR',
    notEnoughBillsErrorMessage = 'language-editor-exchange-notEnoughBillsErrorMessage',
    amountNotPossibleErrorMessage = 'language-editor-exchange-amountNotPossibleErrorMessage',
    recommendedAmount = 'language-editor-exchange-recommendedAmount',
    PreviewTitle = 'language-editor-exchange-PreviewTitle',
    PreviewSubtitle = 'language-editor-exchange-PreviewSubtitle',
    exchangeOption = 'language-editor-exchange-exchangeOption',
    noChange = 'language-editor-exchange-noChange',
    Currency = 'language-editor-exchange-Currency',
    ConfirmDeposit = 'language-editor-exchange-ConfirmDeposit',
    AmountTooLowTitle = 'language-editor-exchange-AmountTooLowTitle',
    AmountTooLowSubtitle = 'language-editor-exchange-AmountTooLowSubtitle',
    InsertMoreBills = 'language-editor-exchange-InsertMoreBills',
    USDtoARS = 'language-editor-exchange-USDtoARS',
    ARStoUSD = 'language-editor-exchange-ARStoUSD',
    PreviewRate = 'language-editor-exchange-PreviewRate',
    PreviewDepositAmount = 'language-editor-exchange-PreviewDepositAmount',
    PreviewDispenseAmount = 'language-editor-exchange-PreviewDispenseAmount'
}
/** Sección, argumento para la función navigate */
export const TEXT = {
    general,
    idle,
    info,
    dispense,
    exchange
}
type TEXT = general | idle | info | dispense | exchange

export const navigate = (
    screen: Screens,
    section?: STYLES | BACKGROUNDS | ICONS | IMAGES | TEXT
): void => {
    //TODO agregar section > language key, icons
    console.log(`Going to: ${screen}${section ? ', section:' + section : ''}`)
    store.set(CurrentScreenAtom, screen)
    if (!section) return

    const isText = screen === Screens.languages
    const targetClass = isText ? 'text-target' : 'target'
    const flashClass = isText ? 'flash-highlight-background' : 'flash-highlight'

    ;(async () => {
        await delay(300)
        const el = document.getElementById(section)
        if (!el) return
        el.classList.add(targetClass)
        await delay(100)
        el.scrollIntoView(scrollConfig)
        await delay(300)
        el.classList.add(flashClass)
        await delay(2000)
        el.classList.remove(targetClass, flashClass)
    })()
}
