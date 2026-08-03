import { CashDispenserService } from '@terminal-services/cash-dispenser-service'
import { allKeysOf } from '../../utils/typeAssertion'
import { ServiceBase } from '@terminal-services/core'

type TSService = 'CashDispenserService'

const baseKeys = allKeysOf<ServiceBase<CashDispenserService>>()(['capabilities', 'dispose', 'init', 'serviceId', 'serviceType', 'status', 'version'])

const _CashDispenserService = (): void => {
    const keys = allKeysOf<CashDispenserService>()([
        'stateName',
        'isAvailable',
        'getDeviceDetail',
        'getMix',
        'isDispensable',
        'dispense'
    ])
}
