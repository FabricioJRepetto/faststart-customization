import { allKeysOf } from '../../utils/typeAssertion'
import { deleteNodeReaction, updateNodeAction, updateNodeReaction } from '../../utils/updateNode'
import { SelectedNodeId } from '../../FlowStorage'
import { store } from '@renderer/utils/context/context'
import { ActionType, NodeAction, ReactionType } from '@renderer/types/types'

const allowedActFields = ['trigger']
const allowedReactFields = ['label', 'reactionCode']

type ActProps = {
    data: NodeAction
    type: ActionType
}

export const ActionEditor = ({ data, type }: ActProps): React.JSX.Element => {
    /** Este elemento contiene todas las keys configurables de cada UIElement.
     * Si se modifica alguna interface/elemento, typescript va a lanzar un error en esta sección. */
    const actionInputs = allKeysOf<keyof NodeAction>()([
        'actionID',
        'reactions',
        'steps',
        'trigger',
        'type'
    ])

    const save = (): void => {
        const aux = {}

        actionInputs.map((k) => {
            const el = document.getElementById(k) as HTMLInputElement
            if (el?.value) {
                if (k === 'trigger') {
                    aux[k] = { type: el.value }
                } else aux[k] = el.value
            }
        })

        // TODO - HARDCODEADO
        // aux['order'] = 0

        updateNodeAction(store.get(SelectedNodeId)!, data.actionID, aux)
    }

    return (
        <div className="node-prop-editor">
            {actionInputs
                .filter((f) => allowedActFields.includes(f))
                .map((k, i) =>
                    k === 'trigger' ? (
                        <div key={type + k + i}>
                            <p>{k}</p>
                            <select key={type + k + i} id={k} defaultValue={data.trigger.type}>
                                <option key={'user'} value={'user'}>
                                    user
                                </option>
                                <option key={'auto'} value={'auto'}>
                                    auto
                                </option>
                            </select>
                        </div>
                    ) : (
                        <div key={type + k + i}>
                            <p>{k}</p>
                            <input id={k} type="text" placeholder={data[k]}></input>
                        </div>
                    )
                )}
            <div
                className="action-option"
                style={{
                    width: 'fit-content',
                    padding: '2px 20px',
                    alignSelf: 'end',
                    margin: '10px 10px 0 0'
                }}
                onClick={save}
            >
                save
            </div>
        </div>
    )
}

type ReProps = {
    data: ReactionType
    actionID: string
    reactionID: string
}

export const ReactionEditor = ({ data, actionID, reactionID }: ReProps): React.JSX.Element => {
    const reactionInputs = allKeysOf<keyof ReactionType>()([
        'id',
        'label',
        'reactionCode',
        'target'
    ])

    const save = (): void => {
        const aux = {}

        reactionInputs.map((k) => {
            const el = document.getElementById(reactionID + k) as HTMLInputElement
            if (el?.value) aux[k] = el.value
        })

        // TODO - HARDCODEADO
        // aux['order'] = 0

        updateNodeReaction(store.get(SelectedNodeId)!, actionID, reactionID, aux)
    }

    const deleteR = (): void => {
        deleteNodeReaction(store.get(SelectedNodeId)!, actionID, reactionID)
    }

    return (
        <div className="node-prop-editor">
            <div className="node-prop-editor">
                <div key={reactionID + 'id'}>
                    <p>id</p>
                    <pre style={{ margin: '0 auto' }}>{data.id}</pre>
                </div>
                {reactionInputs
                    .filter((f) => allowedReactFields.includes(f))
                    .map((k, i) => (
                        <div key={reactionID + k + i}>
                            <p>{k === 'reactionCode' ? 'code' : k}</p>
                            <input id={reactionID + k} type="text" placeholder={data[k]}></input>
                        </div>
                    ))}
                <div key={reactionID + 'target'}>
                    <p>target</p>
                    <p style={{ margin: '0 auto' }}>{data.target ?? ''}</p>
                </div>
            </div>

            <div>
                <div
                    className="action-option"
                    style={{
                        width: 'fit-content',
                        padding: '2px 20px',
                        alignSelf: 'end',
                        margin: '10px 10px 0 0'
                    }}
                    onClick={save}
                >
                    save
                </div>
                <div
                    className="action-option"
                    style={{
                        width: 'fit-content',
                        padding: '2px 20px',
                        alignSelf: 'end',
                        margin: '10px 10px 0 0'
                    }}
                    onClick={deleteR}
                >
                    delete
                </div>
            </div>
        </div>
    )
}
