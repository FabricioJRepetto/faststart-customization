// LogicalStep = StoreStep | MathStep | CompareStep | TimeStep | TerminalStep | ServiceStep

import {
    CompareSubtype,
    DelayStep,
    GetVarStep,
    LogicalStep,
    MathSubtype,
    ServiceSubtype,
    SetVarStep,
    StepType,
    StorageSubtype,
    TerminalDispenseStep,
    TerminalSubtype,
    TimeoutStep,
    TimeSubtype
} from '@renderer/types/types.d'
import { allKeysOf } from '../../utils/typeAssertion'
import ArrowSvg from '../../../../assets/arrow_right.svg?react'
import UpSvg from '../../../../assets/arrow_drop_up.svg?react'
import DownSvg from '../../../../assets/arrow_drop_down.svg?react'
import SaveSvg from '../../../../assets/save.svg?react'
import CloseSvg from '../../../../assets/close_small.svg?react'
import { removeLogicStep, sortLogicSteps, updateLogicStep } from '../../utils/updateNode'
import { useState } from 'react'

//__________________________________________________________________ CallServiceSteps
export const ServiceSteps = allKeysOf<ServiceSubtype>()(['login'])

interface CallServiceProps {
    up: () => void
    down: () => void
    remove: () => void
    // save: (props: Record<string, unknown>) => void
    subtype: ServiceSubtype
}

const CallServiceCards = ({ subtype, remove, up, down }: CallServiceProps): React.JSX.Element => {
    // const [value_1, setVal_1] = useState<string>('')
    // const [value_2, setVal_2] = useState<string>('')

    switch (subtype) {
        case 'login':
            return (
                <div className="logic-step-card callService">
                    {subtype} <ArrowSvg />
                    <p>(previous 2 steps values)</p>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
    }
}

interface RunServiceProps {
    up: () => void
    down: () => void
    remove: () => void
    save: (props: Record<string, unknown>) => void
    subtype: TerminalSubtype
    data: TerminalDispenseStep
}
const RunServiceCards = ({
    subtype,
    data,
    save,
    remove,
    up,
    down
}: RunServiceProps): React.JSX.Element => {
    const [value_1, setVal_1] = useState<string>(data?.props?.amount?.toString() ?? '')
    const [value_2, setVal_2] = useState<string>(data?.props?.currency ?? '')

    switch (subtype) {
        case 'dispense':
            return (
                <div className="logic-step-card runService">
                    {subtype} <ArrowSvg />
                    {'$'}
                    <label htmlFor="value_2">
                        <input
                            id="value_2"
                            type="text"
                            placeholder="currency"
                            onChange={(e) => setVal_2(e.target.value)}
                            style={{ width: '40px' }}
                        />
                    </label>
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="text"
                            placeholder="alias"
                            onChange={(e) => setVal_1(e.target.value)}
                            style={{ width: '60px' }}
                        />
                    </label>
                    <div
                        className="logic-step-card-button divider"
                        onClick={() => save({ props: { amount: value_1, currency: value_2 } })}
                    >
                        <SaveSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
    }
}

interface StorageStepProps {
    up: () => void
    down: () => void
    remove: () => void
    save: (props: Record<string, unknown>) => void
    type: StorageSubtype
    data: GetVarStep | SetVarStep
}
const StorageCards = ({
    type,
    data,
    save,
    remove,
    up,
    down
}: StorageStepProps): React.JSX.Element => {
    const [value_1, setVal_1] = useState<string>(data?.subtype ?? '')
    // const [value_2, setVal_2] = useState<string>('')

    switch (type) {
        case 'getVar':
            return (
                <div className="logic-step-card getVar">
                    {'Get'} <ArrowSvg />
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="text"
                            placeholder="alias"
                            value={value_1}
                            onChange={(e) => setVal_1(e.target.value)}
                        />
                    </label>
                    <div
                        className="logic-step-card-button divider"
                        onClick={() => save({ subtype: value_1 })}
                    >
                        <SaveSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
        case 'setVar':
            return (
                <div className="logic-step-card getVar">
                    {'Save'}
                    <ArrowSvg />
                    <p>(previous step value)</p>
                    as
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="text"
                            placeholder="alias"
                            onChange={(e) => setVal_1(e.target.value)}
                        />
                    </label>
                    {/* <label htmlFor="value_2">
                        <input
                            id="value_2"
                            type="text"
                            placeholder="value"
                            onChange={(e) => setVal_2(e.target.value)}
                        />
                    </label> */}
                    <div
                        className="logic-step-card-button divider"
                        onClick={() => save({ subtype: value_1 })}
                    >
                        <SaveSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
    }
}

interface TimeStepProps {
    up: () => void
    down: () => void
    remove: () => void
    save: (props: Record<string, unknown>) => void
    subtype: TimeSubtype
    data: TimeoutStep | DelayStep
}
const TimeCards = ({ subtype, data, save, remove, up, down }: TimeStepProps): React.JSX.Element => {
    const [value_1, setVal_1] = useState<string>(data?.value?.toString() ?? '')

    switch (subtype) {
        case 'timeout':
            return (
                <div className="logic-step-card time">
                    {'Timeout on'}
                    <ArrowSvg />
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="number"
                            value={value_1}
                            onChange={(e) => setVal_1(e.target.value)}
                            style={{ width: '40px' }}
                        />
                    </label>
                    seconds
                    <div
                        className="logic-step-card-button divider"
                        onClick={() => save({ value: value_1 })}
                    >
                        <SaveSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
        case 'delay':
            return (
                <div className="logic-step-card time">
                    {'Wait for'}
                    <ArrowSvg />
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="number"
                            onChange={(e) => setVal_1(e.target.value)}
                            style={{ width: '40px' }}
                        />
                    </label>
                    seconds
                    <div
                        className="logic-step-card-button divider"
                        onClick={() => save({ value: [value_1] })}
                    >
                        <SaveSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
    }
}
interface MathStepProps {
    up: () => void
    down: () => void
    remove: () => void
    save: (props: Record<string, unknown>) => void
    subtype: MathSubtype
}
const MathCards = ({ subtype, save, remove, up, down }: MathStepProps): React.JSX.Element => {
    const [value_1, setVal_1] = useState<string>('')
    const [value_2, setVal_2] = useState<string>('')

    const connector = subtype === 'sum' ? ' + ' : subtype === 'rest' ? ' - ' : ' or '
    switch (subtype) {
        case 'max':
        case 'min':
        case 'rest':
        case 'sum':
            // TODO Puede aceptar más valores
            return (
                <div className="logic-step-card math">
                    {subtype} <ArrowSvg />
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="text"
                            placeholder="alias A"
                            onChange={(e) => setVal_1(e.target.value)}
                        />
                    </label>
                    {connector}
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="text"
                            placeholder="alias B"
                            onChange={(e) => setVal_2(e.target.value)}
                        />
                    </label>
                    <div
                        className="logic-step-card-button divider"
                        onClick={() => save({ value: [value_1, value_2] })}
                    >
                        <SaveSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
    }
}
interface CompareStepProps {
    up: () => void
    down: () => void
    remove: () => void
    save: (props: Record<string, unknown>) => void
    subtype: CompareSubtype
}
const CompareCards = ({ subtype, save, remove, up, down }: CompareStepProps): React.JSX.Element => {
    const [value_1, setVal_1] = useState<string>('')
    const [value_2, setVal_2] = useState<string>('')

    let connector = ''
    switch (subtype) {
        case 'eq':
            connector = ' == '
            break
        case 'neq':
            connector = ' != '
            break
        case 'gt':
            connector = ' > '
            break
        case 'gte':
            connector = ' >= '
            break
        case 'lt':
            connector = ' < '
            break
        case 'lte':
            connector = ' <= '
            break
    }

    switch (subtype) {
        case 'eq':
        case 'neq':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
            return (
                <div className="logic-step-card compare">
                    {subtype} <ArrowSvg />
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="text"
                            placeholder="alias A"
                            onChange={(e) => setVal_1(e.target.value)}
                        />
                    </label>
                    {connector}
                    <label htmlFor="value_1">
                        <input
                            id="value_1"
                            type="text"
                            placeholder="alias B"
                            onChange={(e) => setVal_2(e.target.value)}
                        />
                    </label>
                    <div
                        className="logic-step-card-button divider"
                        onClick={() => save({ value: [value_1, value_2] })}
                    >
                        <SaveSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={up}>
                        <UpSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={down}>
                        <DownSvg />
                    </div>
                    <div className="logic-step-card-button" onClick={remove}>
                        <CloseSvg />
                    </div>
                </div>
            )
    }
}

//__________________________________________________________________ All Step Cards

export const StorageSteps = allKeysOf<StorageSubtype>()(['setVar', 'getVar'])
export const TerminalSteps = allKeysOf<TerminalSubtype>()(['dispense'])
export const TimeSteps = allKeysOf<TimeSubtype>()(['timeout', 'delay'])
export const MathSteps = allKeysOf<MathSubtype>()(['max', 'min', 'rest', 'sum'])
export const CompareSteps = allKeysOf<CompareSubtype>()(['eq', 'neq', 'gt', 'gte', 'lt', 'lte'])

//__________________________________________________________________ StepsCard
interface Props {
    type: StepType
    subtype: string
    nodeID: string
    actionID: string
    stepID: string
    data: LogicalStep
    children: React.ReactNode
}

const StepsCard = ({
    type,
    subtype,
    nodeID,
    actionID,
    stepID,
    data,
    children
}: Props): React.JSX.Element => {
    const save = (props): void => updateLogicStep(nodeID, actionID, stepID, props)
    const remove = (): void => removeLogicStep(nodeID, actionID, stepID)

    const up = (): void => {
        if (data.order === 0) return
        sortLogicSteps(nodeID, actionID, stepID, data.order - 1, 'up')
    }
    const down = (): void => {
        sortLogicSteps(nodeID, actionID, stepID, data.order + 1, 'down')
    }

    switch (type) {
        case 'callService':
            return (
                <div className="logic-step-card-wrapper">
                    <CallServiceCards
                        subtype={subtype as ServiceSubtype}
                        remove={remove}
                        up={up}
                        down={down}
                    />
                    {children && children}
                </div>
            )

        case 'runService':
            return (
                <div className="logic-step-card-wrapper">
                    <RunServiceCards
                        subtype={subtype as TerminalSubtype}
                        remove={remove}
                        up={up}
                        down={down}
                        save={save}
                        data={data as TerminalDispenseStep}
                    />
                    {children && children}
                </div>
            )

        case 'getVar':
        case 'setVar':
            return (
                <div className="logic-step-card-wrapper">
                    <StorageCards
                        type={type}
                        remove={remove}
                        save={save}
                        data={data as SetVarStep | GetVarStep}
                        up={up}
                        down={down}
                    />
                    {children && children}
                </div>
            )

        case 'time':
            return (
                <div className="logic-step-card-wrapper">
                    <TimeCards
                        subtype={subtype as TimeSubtype}
                        remove={remove}
                        save={save}
                        up={up}
                        down={down}
                        data={data as TimeoutStep | DelayStep}
                    />
                    {children && children}
                </div>
            )

        case 'compare':
            return (
                <div className="logic-step-card-wrapper">
                    <CompareCards
                        subtype={subtype as CompareSubtype}
                        remove={remove}
                        save={save}
                        up={up}
                        down={down}
                    />
                    {children && children}
                </div>
            )

        case 'math':
            return (
                <div className="logic-step-card-wrapper">
                    <MathCards
                        subtype={subtype as MathSubtype}
                        remove={remove}
                        save={save}
                        up={up}
                        down={down}
                    />
                    {children && children}
                </div>
            )
    }
}

export default StepsCard
