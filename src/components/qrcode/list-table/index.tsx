import { useMemo, useState } from "react";
import { useTranslate } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import type { IQRCode } from "../../../interfaces";
import IconButton from "@mui/material/IconButton";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { QRCodeStatus } from "../status";
import { Dialog, DialogContent } from "@mui/material";
import { QRcodeShowDrawer } from "../show";

export const QRcodeListTable = () => {
  const t = useTranslate();

  const [open, setOpen] = useState<boolean>(false);
  const [openShowDrawer, setOpenShowDrawer] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<IQRCode | null>(null);

  // Fetching data using useDataGrid with proper pagination and queryOptions
  const { dataGridProps } = useDataGrid<IQRCode>({
    resource: "qrcodes",
    dataProviderName: "qrcodes",
    pagination: { pageSize: 10 }, // Ensuring pagination is set up
    queryOptions: {
      select: (data) => ({
        data: data.data?.qrcodes ?? [], // Default to empty array if no data
        total: data.data?.total ?? 0, // Default total count to 0
      }),
    },
  });

  // Ensure rows are always an array
  const rows = Array.isArray(dataGridProps?.rows) ? dataGridProps.rows : [];

  const handleOpen = (image: string | null) => {
    if (image) {
      setSelectedImage(image);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleShowRow = (row: IQRCode) => {
    setSelectedRow(row);
    setOpenShowDrawer(true);
  };

  const handleCloseShowDrawer = () => {
    setOpenShowDrawer(false);
    setSelectedRow(null);
  };

  const columns = useMemo<GridColDef<IQRCode>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        description: "ID",
        width: 52,
        display: "flex",
        renderCell: function render({ row }) {
          return <Typography>{row.id}</Typography>;
        },
      },
      {
        field: "image",
        headerName: t("qrcodes.fields.images.label"),
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <Avatar
              variant="rounded"
              sx={{
                width: 32,
                height: 32,
              }}
              src={row.image}
              alt="QR Code"
              style={{ width: 50, height: 50, cursor: "pointer" }}
              onClick={() => handleOpen(row.image)}
            />
          );
        },
        width: 64,
        align: "center",
        headerAlign: "center",
        sortable: false,
      },
      {
        field: "token",
        headerName: t("qrcodes.fields.token"),
        minWidth: 320,
        sortable: false,
      },
      {
        field: "valid",
        headerName: t("qrcodes.fields.valid.label"),
        minWidth: 136,
        display: "flex",
        renderCell: function render({ row }) {
          return <QRCodeStatus value={row.valid} />;
        },
      },
      {
        field: "url",
        headerName: "URL",
        minWidth: 250,
        sortable: false,
        renderCell: (params) => (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#1976d2" }}
          >
            {params.value}
          </a>
        ),
      },

      {
        field: "actions",
        headerName: t("table.actions"),
        type: "actions",
        align: "center",
        headerAlign: "center",
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <IconButton
              sx={{
                cursor: "pointer",
              }}
              onClick={() => handleShowRow(row)}
            >
              <VisibilityOutlined color="action" />
            </IconButton>
          );
        },
      },
    ],
    [t]
  );

  return (
    <>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        rows={rows}
        pageSizeOptions={[12, 24, 36, 48]}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ textAlign: "center" }}>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Expanded QR Code"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          ) : (
            <Typography>No image available</Typography>
          )}
        </DialogContent>
      </Dialog>

      <QRcodeShowDrawer
        open={openShowDrawer}
        onClose={handleCloseShowDrawer}
        record={selectedRow}
      />
    </>
  );
};
