import SidebarMenu from './SidebarMenu'

type ScreenContainerProps = {
    children: React.ReactNode // Explicitly defining the children prop
}
const ScreenWrapper = ({ children }: ScreenContainerProps): React.JSX.Element => {
    return (
        <>
            {children}
            <SidebarMenu />
        </>
    )
}

export default ScreenWrapper
