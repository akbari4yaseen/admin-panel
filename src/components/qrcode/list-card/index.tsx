import { useMemo } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { NumberField, type UseDataGridReturnType } from "@refinedev/mui";
import Typography from "@mui/material/Typography";
import type { ICategory, IQRCode } from "../../../interfaces";
import { useLocation } from "react-router";
import { QRCodeStatus } from "../status";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

type Props = {} & UseDataGridReturnType<IQRCode>;

export const QRcodeListCard = (props: Props) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const products = props.tableQueryResult?.data?.data || [];

  const categoryFilters = useMemo(() => {
    const filter = props.filters.find((filter) => {
      if ("field" in filter) {
        return filter.field === "category.id";
      }

      return false;
    });

    const filterValues = filter?.value?.map((value: string | number) =>
      Number(value)
    );

    return {
      operator: filter?.operator || "in",
      value: (filterValues || []) as number[],
    };
  }, [props.filters]).value;

  const hasCategoryFilter = categoryFilters?.length > 0;

  return (
    <>
      <Divider />
      <Stack direction="row" spacing="12px" py="16px">
        <Chip
          color={hasCategoryFilter ? undefined : "primary"}
          sx={{
            color: hasCategoryFilter ? "undefined" : "white",
          }}
          label={`🏷️ ${t("products.filter.allCategories.label")}`}
          onClick={() => {
            props.setFilters([
              {
                field: "category.id",
                operator: "in",
                value: [],
              },
            ]);
            props.setCurrent(1);
          }}
        />
      </Stack>
      <Divider />
      <Grid
        container
        spacing={3}
        sx={{
          marginTop: "24px",
        }}
      >
        {products?.map((product) => {
          return (
            <Grid
              key={product.id}
              size={{
                sm: 3,
                md: 4,
                lg: 3,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardActionArea
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "normal",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      "&:hover": {
                        ".view-button": {
                          display: "flex",
                        },
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.image}
                      alt={product.token}
                    />
                    <Button
                      className="view-button"
                      variant="contained"
                      color="inherit"
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => {
                        return go({
                          to: `${editUrl("products", product.id)}`,
                          query: {
                            to: pathname,
                          },
                          options: {
                            keepQuery: true,
                          },
                          type: "replace",
                        });
                      }}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: "50%",
                        transform: "translate(50%, -50%)",
                        display: "none",
                        zIndex: 1,
                      }}
                    >
                      {t("buttons.edit")}
                    </Button>
                  </Box>

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      marginTop: "auto",
                      borderTop: "1px solid",
                      borderColor: (theme) => theme.palette.divider,
                    }}
                  >
                    <Chip
                      size="small"
                      variant="outlined"
                      sx={{
                        backgroundColor: "transparent",
                      }}
                      label={"category"}
                    />
                    <QRCodeStatus size="small" value={product.valid} />
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Divider
        sx={{
          marginTop: "24px",
        }}
      />
      <TablePagination
        component="div"
        count={props.dataGridProps.rowCount}
        page={props.dataGridProps.paginationModel?.page || 0}
        rowsPerPage={props.dataGridProps.paginationModel?.pageSize || 10}
        rowsPerPageOptions={[10, 24, 48, 96]}
        onRowsPerPageChange={(e) => {
          props.setPageSize(+e.target.value);
        }}
        onPageChange={(_e, page) => {
          props.setCurrent(page + 1);
        }}
      />
    </>
  );
};
