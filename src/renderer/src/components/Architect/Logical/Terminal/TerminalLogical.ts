import { CashDispenserService } from '@terminal-services/cash-dispenser-service'
import { allKeysOf } from '../../utils/typeAssertion'
import { ServiceBase } from '@terminal-services/core'

export type TSService = 'CashDispenserService'

const baseKeys = allKeysOf<keyof ServiceBase<CashDispenserService>>()(['capabilities', 'dispose', 'init', 'serviceId', 'serviceType', 'status', 'version'])

export const _CashDispenserService = (): void => {
    const keys = allKeysOf<keyof CashDispenserService>()([
        ...baseKeys,
        'stateName',
        'isAvailable',
        'getDeviceDetail',
        'getMix',
        'isDispensable',
        'dispense'
    ])
    console.log(keys);
    
}
