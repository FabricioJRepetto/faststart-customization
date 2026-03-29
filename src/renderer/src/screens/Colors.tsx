import { APPSETTINGS_CONFIGURATION_MODULE } from '@renderer/utils/CONSTANTS'
import { AppSettingsAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'

const Colors = (): React.JSX.Element => {
    const [appsettings] = useAtom(AppSettingsAtom)

    const { PrimaryColor, SecondaryColor, ErrorMessageColor } = appsettings?.Modules.find(
        (e) => e.Assembly === APPSETTINGS_CONFIGURATION_MODULE
    )?.Options?.Contexts[0].Data

    return (
        <div className="screen-content">
            <h1>Colors</h1>

            <div className="color-asset-container">
                <div>
                    <p>PrimaryColor: {PrimaryColor.Value}</p>
                    <div
                        className="color-sample"
                        style={{ backgroundColor: PrimaryColor.Value }}
                    ></div>
                </div>

                <label>
                    <input type="color" />
                    Seleccionar color
                </label>
            </div>

            <div className="color-asset-container">
                <div>
                    <span>SecondaryColor: {SecondaryColor.Value}</span>
                    <div
                        className="color-sample"
                        style={{ backgroundColor: SecondaryColor.Value }}
                    ></div>
                </div>

                <label>
                    <input type="color" />
                    Seleccionar color
                </label>
            </div>

            <div className="color-asset-container">
                <div>
                    <p>ErrorMessageColor: {ErrorMessageColor.Value}</p>
                    <div
                        className="color-sample"
                        style={{ backgroundColor: ErrorMessageColor.Value }}
                    ></div>
                </div>

                <label>
                    <input type="color" />
                    Seleccionar color
                </label>
            </div>
        </div>
    )
}

export default Colors
