import Chip, { type ChipProps } from "@mui/material/Chip";
import { useTranslate } from "@refinedev/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import type { IQRCode } from "../../../interfaces";

type Props = {
  value: IQRCode["valid"];
  size?: ChipProps["size"];
};

export const QRCodeStatus = (props: Props) => {
  const t = useTranslate();
  const { palette } = useTheme();
  const isDarkMode = palette.mode === "dark";

  const color = props.value
    ? isDarkMode
      ? green[200]
      : green[800]
    : "default";
  const icon: ChipProps["icon"] = props.value ? (
    <CheckCircleIcon
      sx={{
        fill: isDarkMode ? green[200] : green[600],
      }}
    />
  ) : (
    <ClearIcon color="error" />
  );

  return (
    <Chip
      label={t(`qrcodes.fields.valid.${props.value}`)}
      icon={icon}
      variant="outlined"
      size={props?.size || "small"}
      sx={{
        borderColor: color,
        color: color,
      }}
    />
  );
};
