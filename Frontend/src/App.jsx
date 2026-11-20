import { useDevice } from "./useDevice";

import MobileScreen from "./views/Mobile/MobileScreen";
import DesktopScreen from "./views/Desktop/DesktopScreen";

function App() {
  const { isMobile , isTablet , isDesktop } = useDevice();

  return (
    <>
      {isMobile && <MobileScreen />}
      {isTablet || isDesktop && <DesktopScreen />}
    </>
  )
}

export default App
