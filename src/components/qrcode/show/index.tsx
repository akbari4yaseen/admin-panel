import { useApiUrl, useNotification, useTranslate } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Drawer, DrawerHeader } from "../../../components";
import { QRCodeStatus } from "../status";
import type { IQRCode } from "../../../interfaces";
import { DateField } from "@refinedev/mui";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { Button, Divider, Paper, CircularProgress } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LinkIcon from "@mui/icons-material/Link";
import QrCodeIcon from "@mui/icons-material/QrCode";
import VerifiedIcon from "@mui/icons-material/Verified";
import { axiosInstance } from "../../../utils";
import { useCallback, useState } from "react";

type QRcodeShowDrawerProps = {
  open: boolean;
  onClose: () => void;
  record: IQRCode | null;
};

export const QRcodeShowDrawer = ({ open, onClose, record }: QRcodeShowDrawerProps) => {
  const apiUrl = useApiUrl();
  const t = useTranslate();
  const notify = useNotification();

  const [loading, setLoading] = useState<{ delete: boolean; invalidate: boolean }>({
    delete: false,
    invalidate: false,
  });

  const handleAction = useCallback(
    async (action: "delete" | "invalidate") => {
      if (!record) return;

      setLoading((prev) => ({ ...prev, [action]: true }));
      const url = action === "delete" ? `${apiUrl}/qr/${record.token}` : `${apiUrl}/invalidate/${record.token}`;
      const method = action === "delete" ? axiosInstance.delete : axiosInstance.post;

      try {
        await method(url);
        notify?.open?.({
          type: "success",
          message: t(`notifications.${action}Success`),
        });
        onClose(); // Close the drawer
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || t(`notifications.${action}Error`);
        notify?.open?.({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setLoading((prev) => ({ ...prev, [action]: false }));
      }
    },
    [apiUrl, notify, onClose, record, t]
  );

  if (!record) {
    return <Typography>{t("qrcodes.noRecord")}</Typography>;
  }

  const renderButton = (action: "delete" | "invalidate", labelKey: string, Icon: JSX.Element) => {
    const isLoading = loading[action];
    return (
      <Button
        color={action === "delete" ? "error" : "warning"}
        variant="contained"
        startIcon={isLoading ? <CircularProgress size={24} /> : Icon}
        onClick={() => handleAction(action)}
        disabled={isLoading}
      >
        {isLoading ? t(`buttons.${labelKey}ing`) : t(`buttons.${labelKey}`)}
      </Button>
    );
  };

  return (
    <Drawer
      slotProps={{ paper: { sx: { width: { sm: "100%", md: "500px" } } } }}
      open={open}
      anchor="right"
      onClose={onClose}
    >
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
          <Stack
            direction="row"
            justifyContent="space-between"
            padding="16px 24px"
          >
            {renderButton("delete", "delete", <DeleteIcon />)}
            {renderButton("invalidate", "invalidate", <BlockIcon />)}
          </Stack>
        </Stack>
      </>
    </Drawer>
  );
};
