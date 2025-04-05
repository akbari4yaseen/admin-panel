import { useMemo, useState } from "react";
import { useTranslate } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Stack,
  Divider,
  Typography,
  CardActions,
  TablePagination,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { QRCodeStatus } from "../status";
import { QRcodeShowDrawer } from "../show";
import { IQRCode } from "../../../interfaces";

export const QRcodeListCard = () => {
  const t = useTranslate();

  const [openShowDrawer, setOpenShowDrawer] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IQRCode | null>(null);

  // Fetching data using useDataGrid with proper pagination and queryOptions
  const { dataGridProps, setPageSize, setCurrent } = useDataGrid<IQRCode>({
    resource: "qrcodes",
    dataProviderName: "qrcodes",
    pagination: { pageSize: 12 }, // Ensuring pagination is set up
  });

  const { rows, paginationModel, rowCount } = dataGridProps;

  // Memoizing rows to avoid unnecessary rerenders
  const memoizedRows = useMemo(() => rows ?? [], [rows]);

  const handleShowRow = (row: IQRCode) => {
    setSelectedRow(row);
    setOpenShowDrawer(true);
  };

  const handleCloseShowDrawer = () => {
    setOpenShowDrawer(false);
    setSelectedRow(null);
  };

  return (
    <>
      <Divider />
      <Grid container spacing={3} sx={{ marginTop: "24px" }}>
        {memoizedRows.map((qrCode) => (
          <Grid key={qrCode.id} size={{ sm: 3, md: 4, lg: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "normal",
                  height: "100%",
                }}
                onClick={() => handleShowRow(qrCode)}
              >
                <CardMedia
                  component="img"
                  image={qrCode.image}
                  alt={`QR Code ${qrCode.token}`} // Improved alt text for accessibility
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t("qrcodes.fields.token")}: </strong>{" "}
                      {qrCode.token}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    marginTop: "auto",
                    display: "block",
                    borderTop: "1px solid",
                    borderColor: (theme) => theme.palette.divider,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <strong>{t("qrcodes.valid")}: </strong>
                    <QRCodeStatus value={qrCode.valid} size="small" />
                  </Stack>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ marginTop: "24px" }} />

      <TablePagination
        component="div"
        count={rowCount || 0}
        page={paginationModel?.page || 0}
        rowsPerPage={paginationModel?.pageSize || 12}
        rowsPerPageOptions={[12, 24, 36, 48, 96]}
        onRowsPerPageChange={(e) => setPageSize(+e.target.value)}
        onPageChange={(_e, page) => setCurrent(page + 1)}
        aria-label="QR Code Pagination"
      />

      {/* QRCode Detail Drawer */}
      <QRcodeShowDrawer
        open={openShowDrawer}
        onClose={handleCloseShowDrawer}
        record={selectedRow}
      />
    </>
  );
};
