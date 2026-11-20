import { useTheme , useMediaQuery } from "@mui/material";

export const useDevice = () => {
    const theme = useTheme();
    
    return {
        isMobile: useMediaQuery(theme.breakpoints.down("sm")),
        isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")),
        isDesktop: useMediaQuery(theme.breakpoints.up("md")),
    }
}