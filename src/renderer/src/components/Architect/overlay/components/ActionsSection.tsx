import DropUpSvg from '../../../../assets/arrow_drop_up.svg?react'
import DropDownSvg from '../../../../assets/arrow_drop_down.svg?react'
import DeleteSvg from '../../../../assets/close_small.svg?react'
import AutoSvg from '../../../../assets/automation.svg?react'
import {
    addNodeAction,
    addNodeReaction,
    deleteNodeAction,
} from '../../utils/updateNode'
import { ActionEditor, ReactionEditor } from './ActionEditor'
import { ActionType, FlowNode, NodeAction } from '@renderer/types/types.d'

interface Props {
    open: boolean
    setOpen: (v: 'actions' | null) => void
    openLogicFlow: (data: NodeAction) => void
    node: FlowNode
}

const ActionsSection = ({ open, setOpen, openLogicFlow, node }: Props): React.JSX.Element => {
    const addAction = (e: ActionType): void => {
        switch (e) {
            case 'terminal':
                addNodeAction(node.id, ActionType.terminal, 'dispenser')
                break

            case 'user':
                addNodeAction(node.id, ActionType.user)
                break

            case 'timeout':
                addNodeAction(node.id, ActionType.timeout)
                break
         
            case 'service':
                addNodeAction(node.id, ActionType.service)
                break

            default:
                console.warn('Action type not implemented')
                break
        }
    }

    const addR = (actionID: string): void => {
        addNodeReaction(node.id, actionID)
    }

    return (
        <div className={`properties-menu-section ${open ? 'section-open' : ''}`}>
            <div
                className={`properties-menu-section-header`}
                onClick={() => setOpen(open ? null : 'actions')}
            >
                <p>Actions</p>
                {open ? <DropUpSvg /> : <DropDownSvg />}
            </div>
            <div className="actions-options">
                {Object.keys(ActionType).map((e) => (
                    <div
                        key={e}
                        className={`action-option ${e}`}
                    >
                        <a
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => addAction(e as ActionType)}
                        >
                            + {e}
                        </a>
                    </div>
                ))}
            </div>

            {node.data.actions.map((a) => (
                <div key={a.actionID} className="action-container">
                    <div className={`action-container-header`} style={{ margin: '5px' }}>
                        <p className={a.type}>{a.actionID}</p>
                        <span onClick={() => deleteNodeAction(node.id, a.type, a.actionID)}>
                            <DeleteSvg />
                        </span>
                    </div>

                    <div key={a.actionID} className="action-container-data">
                        <ActionEditor data={a} type={a.type} />
                    </div>

                    <div className="action-container-header" style={{ margin: '15px 10px 10px 0' }}>
                        <div className="action-option" onClick={() => openLogicFlow(a)}>
                            <AutoSvg />
                            Logical Flow
                        </div>
                    </div>

                    <div className="action-container-header">
                        <p>Reactions</p>
                        <div className="action-option" onClick={() => addR(a.actionID)}>
                            + Reaction
                        </div>
                    </div>
                    {a.reactions.map((r) => (
                        <div key={r.id} className="action-container-data">
                            <ReactionEditor data={r} actionID={a.actionID} reactionID={r.id} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default ActionsSection
