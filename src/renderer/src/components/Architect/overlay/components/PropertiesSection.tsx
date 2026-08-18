import DropUpSvg from '../../../../assets/arrow_drop_up.svg?react'
import DropDownSvg from '../../../../assets/arrow_drop_down.svg?react'
import { useEffect, useState } from 'react'
import { updateNodeProps } from '../../utils/updateNode'
import { FlowNode, ScreenType } from '@renderer/types/types.d'

interface Props {
    open: boolean
    setOpen: (v: 'props' | null) => void
    node: FlowNode
}

const PropertiesSection = ({ open, setOpen, node }: Props): React.JSX.Element => {
    const [nodeName, setNodeName] = useState<string>('')
    const [nodeType, setNodeType] = useState<ScreenType>()
    const [closeTO, setCloseTO] = useState<boolean>()

    const saveNodeProps = (): void => {
        if (!nodeName || !nodeType) return
        updateNodeProps(node.id!, nodeName, nodeType, !!closeTO)
    }

    useEffect(() => {
        // eslint-disable-next-line
        setNodeName(() => node.data.screenName || '')
        setNodeType(() => node.data.screenType)
        setCloseTO(() => node.data.timeout)
    }, [node.data.screenName, node.data.screenType, node.data.timeout, setNodeName])

    return (
        <div className={`properties-menu-section ${open ? 'section-open' : ''}`}>
            <div
                className={`properties-menu-section-header`}
                onClick={() => setOpen(open ? null : 'props')}
            >
                <p>Node props</p>
                {open ? <DropUpSvg /> : <DropDownSvg />}
            </div>
            <div className="action-container-data node-prop-editor">
                <div>
                    <p>name</p>
                    <input
                        type="text"
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                    ></input>
                </div>
                <div>
                    <p>type</p>
                    <select
                        value={node.data.screenType}
                        onChange={(e) => setNodeType(e.target.value as ScreenType)}
                    >
                        {Object.keys(ScreenType).map((op) => (
                            <option key={op} value={op}>
                                {op}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <p>close timeout</p>
                    <input
                        type="radio"
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                    ></input>
                </div>
                <div
                    className="action-option"
                    style={{
                        width: 'fit-content',
                        padding: '2px 20px',
                        alignSelf: 'end',
                        margin: '10px 10px 0 0'
                    }}
                    onClick={saveNodeProps}
                >
                    save
                </div>
            </div>
        </div>
    )
}

export default PropertiesSection
