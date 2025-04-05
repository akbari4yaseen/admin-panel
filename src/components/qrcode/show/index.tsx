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
import React, { useCallback, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { ForwardedPrintData } from "./PrintData";

type QRcodeShowDrawerProps = {
  open: boolean;
  onClose: () => void;
  record: IQRCode | null;
};

const ActionButton = ({
  action,
  labelKey,
  isLoading,
  handleAction,
  Icon,
  translate,
}: {
  action: "delete" | "invalidate" | "validate";
  labelKey: string;
  isLoading: boolean;
  handleAction: () => void;
  Icon: JSX.Element;
  translate: (key: string) => string;
}) => (
  <Button
    color={
      action === "delete"
        ? "error"
        : action === "validate"
        ? "success"
        : "warning"
    }
    variant="contained"
    startIcon={isLoading ? <CircularProgress size={24} /> : Icon}
    onClick={handleAction}
    disabled={isLoading}
  >
    {isLoading
      ? translate(`buttons.${labelKey}ing`)
      : translate(`buttons.${labelKey}`)}
  </Button>
);

export const QRcodeShowDrawer = ({
  open,
  onClose,
  record,
}: QRcodeShowDrawerProps) => {
  const apiUrl = useApiUrl();
  const t = useTranslate();
  const notify = useNotification();

  const [loading, setLoading] = useState({
    delete: false,
    invalidate: false,
    validate: false,
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `QRCode_${record?.id}`,
  });

  const handleAction = useCallback(
    async (action: "delete" | "invalidate" | "validate") => {
      if (!record) return;

      setLoading((prev) => ({ ...prev, [action]: true }));
      let url, method;

      switch (action) {
        case "delete":
          url = `${apiUrl}/qr/${record.token}`;
          method = axiosInstance.delete;
          break;
        case "invalidate":
        case "validate":
          url = `${apiUrl}/${action}/${record.token}`;
          method = axiosInstance.post;
          break;
        default:
          return;
      }

      try {
        await method(url);
        notify?.open?.({
          type: "success",
          message: t(`notifications.${action}Success`),
        });
        onClose(); // Close the drawer
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || t(`notifications.${action}Error`);
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
    return;
  }

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

              <Stack direction="row" alignItems="center" spacing={2}>
                <QrCodeIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("qrcodes.fields.token")}
                  </Typography>
                  <Typography variant="body1">{record.token}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <VerifiedIcon color="primary" />
                <Typography variant="subtitle2" color="text.secondary">
                  {t("qrcodes.fields.valid.label")}
                </Typography>
                <QRCodeStatus value={record.valid} />
              </Stack>

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

              <Stack direction="row" alignItems="center" spacing={2}>
                <AccessTimeIcon color="primary" />
                <Typography variant="subtitle2">
                  {t("qrcodes.fields.createdAt")}
                </Typography>
                <DateField
                  value={record?.created_at}
                  format="MMMM D, YYYY / HH:mm A"
                />
              </Stack>
            </Stack>
          </Paper>

          <Stack
            direction="row"
            justifyContent="space-between"
            padding="16px 24px"
          >
            <ActionButton
              action="delete"
              labelKey="delete"
              isLoading={loading.delete}
              handleAction={() => handleAction("delete")}
              Icon={<DeleteIcon />}
              translate={t}
            />
            <ActionButton
              action={record.valid ? "invalidate" : "validate"}
              labelKey={record.valid ? "invalidate" : "validate"}
              isLoading={loading.invalidate || loading.validate}
              handleAction={() =>
                handleAction(record.valid ? "invalidate" : "validate")
              }
              Icon={record.valid ? <BlockIcon /> : <VerifiedIcon />}
              translate={t}
            />
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => handlePrint()}
            >
              {t("buttons.print")}
            </Button>
          </Stack>
        </Stack>
      </>

      <div style={{ display: "none" }}>
        <ForwardedPrintData ref={printRef} data={record.image} />
      </div>
    </Drawer>
  );
};
