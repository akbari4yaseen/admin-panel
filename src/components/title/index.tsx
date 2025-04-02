import { Link } from "react-router";
import Box from "@mui/material/Box";

import { AppLogoIcon, AppLogoText } from "../icons/app-logo";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  return (
    <Link to="/">
      <Box
        display="flex"
        alignItems="center"
        gap={"12px"}
        sx={{
          color: "text.primary",
        }}
      >
        {collapsed ? (
          <AppLogoIcon />
        ) : (
          <>
            <AppLogoIcon />
            <AppLogoText />
          </>
        )}
      </Box>
    </Link>
  );
};
