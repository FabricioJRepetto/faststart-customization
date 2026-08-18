import StepsCard, {
    CompareSteps,
    MathSteps,
    ServiceSteps,
    StorageSteps,
    TerminalSteps,
    TimeSteps
} from '../../Logical/components/StepsCard'
import { addLogicStep } from '../../utils/updateNode'
import { store } from '@renderer/utils/context/context'
import { FlowNodes, SelectedNodeId } from '../../FlowStorage'
import { LogicFlowSteps } from '../../utils/presets'
import { StepType } from '@renderer/types/types.d'
import { useAtomValue } from 'jotai'

interface Props {
    actionID: string
}

const noEntryVar: string[] = ['time'] 
const noOutVar: StepType[] = ['setVar', 'time'] 

const LogicFlowPanel = ({ actionID }: Props): React.JSX.Element => {
    const nodeID = useAtomValue(SelectedNodeId)
    const data = useAtomValue(FlowNodes)
        .find((n) => n.id === nodeID)
        ?.data.actions.find((a) => a.actionID === actionID)

    if (!nodeID || !data) return <></>

    const addStep = (type: string, subtype: string): void => {
        const nodeID = store.get(SelectedNodeId)
        const actionID = data.actionID
        const step = LogicFlowSteps[subtype]

        console.log(type, subtype, JSON.stringify(step))
        addLogicStep(nodeID!, actionID, step)
    }

    return (
        <div className="logic-flow-container">
            <div className="logic-flow-view scrolleable">
                {data.steps.map((s) => (
                    <StepsCard
                        key={s.id}
                        type={s.type as StepType}
                        subtype={s.subtype}
                        nodeID={nodeID}
                        actionID={data.actionID}
                        stepID={s.id}
                        data={s}
                    >
                        {!noEntryVar.includes(s.type) && (
                            <div className={`step-card-connector-in ${s.type}`}></div>
                        )}
                        {data.steps.length > 1 && !noOutVar.includes(s.type) && (
                            <div className={`step-card-connector-out ${s.type}`}></div>
                        )}
                    </StepsCard>
                ))}
                {/* <pre>{JSON.stringify(data.steps, null, 2)}</pre> */}
            </div>

            <div className="logic-flow-side-panel scrolleable">
                <div className="logic-flow-options-container">
                    <p>Time</p>
                    {TimeSteps.map((subtype, i) => (
                        <div
                            onClick={() => addStep('time', subtype)}
                            className={`logic-step-button time ${subtype}`}
                            key={subtype + i}
                        >
                            {subtype}
                        </div>
                    ))}
                </div>
                <div className="logic-flow-options-container">
                    <p>Storage</p>
                    {StorageSteps.map((subtype, i) => (
                        <div
                            onClick={() => addStep('storage', subtype)}
                            className={`logic-step-button storage ${subtype}`}
                            key={subtype + i}
                        >
                            {subtype}
                        </div>
                    ))}
                </div>
                <div className="logic-flow-options-container">
                    <p>Services</p>
                    {ServiceSteps.map((subtype, i) => (
                        <div
                            onClick={() => addStep('services', subtype)}
                            className={`logic-step-button callService ${subtype}`}
                            key={subtype + i}
                        >
                            {subtype}
                        </div>
                    ))}
                </div>
                <div className="logic-flow-options-container">
                    <p>Terminal</p>
                    {TerminalSteps.map((subtype, i) => (
                        <div
                            onClick={() => addStep('terminal', subtype)}
                            className={`logic-step-button runService ${subtype}`}
                            key={subtype + i}
                        >
                            {subtype}
                        </div>
                    ))}
                </div>
                <div className="logic-flow-options-container">
                    <p>Math</p>
                    {MathSteps.map((subtype, i) => (
                        <div
                            onClick={() => addStep('math', subtype)}
                            className={`logic-step-button math ${subtype}`}
                            key={subtype + i}
                        >
                            {subtype}
                        </div>
                    ))}
                </div>
                <div className="logic-flow-options-container">
                    <p>Compare</p>
                    {CompareSteps.map((subtype, i) => (
                        <div
                            onClick={() => addStep('compare', subtype)}
                            className={`logic-step-button compare ${subtype}`}
                            key={subtype + i}
                        >
                            {subtype}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LogicFlowPanel
