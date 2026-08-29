import { allKeysOf } from '../../utils/typeAssertion'
import {
    ActionType,
    NodeAction,
    ReactionType,
    TerminalRegistryResult
} from '@renderer/types/types.d'

export type TSService = 'dispenser'

interface TerminalAction extends NodeAction {
    type: ActionType.terminal
    actionID: TSService
}

const dispenser = (nodeID: string | number): TerminalAction => {
    const actionID: TSService = 'dispenser'
    const reactions: ReactionType[] = allKeysOf<TerminalRegistryResult>()([
        'OK',
        'CANCELLED',
        'TIMEOUT',
        'ERROR',
    ]).map((e) => ({
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
        steps: [
            {
                order: 0,
                id: actionID,
                type: 'runService',
                subtype: 'dispense'
            }
        ],
        reactions: [...reactions]
    }
}

const TerminalActions: Record<TSService, (nodeID: string | number) => TerminalAction> = {
    dispenser: dispenser
}

export default TerminalActions
