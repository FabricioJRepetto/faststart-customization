import { Images, UIElement } from '@renderer/types/types'
import { TSService } from './TerminalActions'
import { ICashDispenseHandler } from '@terminal-services/cash-dispenser-service'
import { allKeysOf } from '../../utils/typeAssertion'
import { DEFAULT_VIEW } from '@renderer/CONSTANTS'

const dispenser = (): Record<string, UIElement[]> => {
    const views: Record<string, UIElement[]> = {
        [DEFAULT_VIEW]: [
            {
                type: 'Information',
                config: {
                    order: 0,
                    title: 'Dispensando',
                    subtitle: 'espere por favor...',
                    region: 'body'
                }
            }
        ],
        'error': [
            {
                type: 'Information',
                config: {
                    order: 0,
                    title: 'Dispensando',
                    subtitle: 'espere por favor...',
                    region: 'body'
                }
            }
        ]
    }
    const events = [...allKeysOf<keyof ICashDispenseHandler>()([
        'cashPresented',
        'cashTaken',
        'cashNotTaken',
        'cashRetracted',
        'cashRetractFailed',
        'cashDispensed',
        'cashDispenseFailed'
    ])] as const;
    type DispenseEvents = typeof events[number]

    const titles: Record<DispenseEvents, string> = {
        cashPresented: 'Tome su dinero',
        cashTaken: 'Espere por favor',
        cashNotTaken: 'Espere por favor',
        cashRetracted: 'Espere por favor',
        cashRetractFailed: 'Espere por favor',
        cashDispensed: 'Espere por favor',
        cashDispenseFailed: 'Espere por favor'
    }
    const subtitles: Record<DispenseEvents, string | undefined> = {
        cashPresented: undefined,
        cashTaken: undefined,
        cashNotTaken: 'retractando billetes',
        cashRetracted: undefined,
        cashRetractFailed: undefined,
        cashDispensed: 'dispensado completado',
        cashDispenseFailed: 'dispensado fallido'
    }
    const illustration: Record<DispenseEvents, Images | undefined> = {
        cashPresented: 'image_take_bills',
        cashTaken: 'image_wait',
        cashNotTaken: 'image_wait',
        cashRetracted: 'image_wait',
        cashRetractFailed: 'image_wait',
        cashDispensed: 'image_success',
        cashDispenseFailed: 'image_error'
    }

    events.map((id) => {
        views[id] = [
            {
                type: 'Information',
                config: {
                    order: 0,
                    title: titles[id],
                    subtitle: subtitles[id],
                    text: id,
                    illustration: illustration[id],
                    region: 'body'
                }
            }
        ]
    })

    return views
}

const TerminalViews: Record<TSService, () => Record<string, UIElement[]>> = {
    dispenser: dispenser
}

export default TerminalViews
