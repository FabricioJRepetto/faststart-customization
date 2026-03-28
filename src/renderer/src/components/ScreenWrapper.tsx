import SidebarMenu from './SidebarMenu'

type ScreenContainerProps = {
    children: React.ReactNode // Explicitly defining the children prop
}
const ScreenWrapper = ({ children }: ScreenContainerProps): React.JSX.Element => {
    return (
        <>
            <SidebarMenu />
            {children}
        </>
    )
}

export default ScreenWrapper
