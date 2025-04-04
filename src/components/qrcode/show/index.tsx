import { useTranslate } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Drawer, DrawerHeader } from "../../../components";
import { QRCodeStatus } from "../status";
import type { IQRCode } from "../../../interfaces";
import { DateField } from "@refinedev/mui";
import { Divider, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LinkIcon from "@mui/icons-material/Link";
import QrCodeIcon from "@mui/icons-material/QrCode";
import VerifiedIcon from "@mui/icons-material/Verified";

type QRcodeShowDrawerProps = {
  open: boolean;
  onClose: () => void;
  record: IQRCode | null;
};

export const QRcodeShowDrawer = ({
  open,
  onClose,
  record,
}: QRcodeShowDrawerProps) => {
  const t = useTranslate();

  return (
    <Drawer
      slotProps={{ paper: { sx: { width: { sm: "100%", md: "500px" } } } }}
      open={open}
      anchor="right"
      onClose={onClose}
    >
      {record && (
        <>
          <DrawerHeader
            title={`${t("qrcodes.actions.details")}\u00A0#${record.id}`}
            onCloseClick={onClose}
          />
          <Stack spacing="24px" padding="24px 24px 42px 24px">
            <Paper>
              <Stack spacing={3} padding="24px">
                {/* QR Image */}
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={record.image}
                    alt="QR Code"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                    }}
                  />
                </Box>

                {/* Token */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <QrCodeIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("qrcodes.fields.token")}
                    </Typography>
                    <Typography variant="body1">{record.token}</Typography>
                  </Box>
                </Stack>

                {/* Valid */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <VerifiedIcon color="primary" />

                  <Typography variant="subtitle2" color="text.secondary">
                    {t("qrcodes.fields.valid.label")}
                  </Typography>
                  <QRCodeStatus value={record.valid} />
                </Stack>

                {/* URL */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <LinkIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("qrcodes.fields.url")}
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href={record.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#1976d2",
                          textDecoration: "underline",
                          wordBreak: "break-all",
                        }}
                      >
                        {record.url}
                      </a>
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                {/* Created At */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="subtitle2">
                    {t("qrcodes.fields.createdAt")}
                  </Typography>
                  <DateField
                    value={record?.created_at}
                    format="MMMM, YYYY / HH:mm A"
                  />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </>
      )}
    </Drawer>
  );
};
