import { ICashDispenseHandler } from '@terminal-services/cash-dispenser-service'
import { allKeysOf } from '../../utils/typeAssertion'
import { ActionType, NodeAction, ReactionType } from '@renderer/types/types.d'

export type TSService = 'dispenser'

interface TerminalAction extends NodeAction {
    type: ActionType.terminal
    actionID: TSService
}

const dispenser = (nodeID: string | number): TerminalAction => {
    const actionID: TSService = 'dispenser'
    const reactions: ReactionType[] = [
        ...allKeysOf<keyof ICashDispenseHandler>()([
            'cashPresented',
            'cashTaken',
            'cashNotTaken',
            'cashRetracted',
            'cashRetractFailed',
            'cashDispensed',
            'cashDispenseFailed'
        ]),
        'error'
    ].map((e) => ({
        reactionCode: e,
        id: `${nodeID}.${ActionType.terminal}.${actionID}.${e}`,
        label: e,
        target: undefined
    }))

    return {
        type: ActionType.terminal,
        actionID: actionID,
        trigger: {
            type: 'auto'
        },
        steps: [],
        reactions: [...reactions]
    }
}

const TerminalActions: Record<TSService, (nodeID: string | number) => TerminalAction> = {
    dispenser: dispenser
}

export default TerminalActions