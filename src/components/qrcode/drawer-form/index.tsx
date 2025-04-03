import {
  type HttpError,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
  useNotification,
} from "@refinedev/core";
import { DeleteButton } from "@refinedev/mui";
import { useSearchParams } from "react-router";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Drawer, DrawerHeader } from "../../../components";
import { axiosInstance } from "../../../utils";

type Props = {
  action: "create" | "edit";
  open: boolean;
  onClose: () => void;
};

export const QRcodeDrawerForm = ({ action, open, onClose }: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const notification = useNotification(); // Ensure we have the notification object

  const onDrawerClose = () => {
    onClose();
    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    refineCore: { id, formLoading },
    saveButtonProps,
  } = useForm({
    defaultValues: {
      count: 1,
    },
    refineCoreProps: {
      resource: "qrcodes",
      redirect: false,
      onMutationSuccess: () => {
        onDrawerClose();
      },
    },
  });

  // API call function
  const handleGenerate = async ({ count }: { count: number }) => {
    const countData = {
      count: parseInt(count.toString()),
    };
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/generates`,
        countData
      );

      notification?.open?.({
        type: "success",
        message: t("qrcodes.success.generate"),
      });

      onDrawerClose();
    } catch (error) {
      console.error("Error:", error); // Debugging line

      notification?.open?.({
        type: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <Drawer
      PaperProps={{ sx: { width: { sm: "100%", md: "416px" } } }}
      open={open}
      anchor="right"
      onClose={onDrawerClose}
    >
      <DrawerHeader
        title={
          action === "create"
            ? t("qrcodes.actions.create")
            : t("qrcodes.actions.edit")
        }
        onCloseClick={onDrawerClose}
      />
      <form onSubmit={handleSubmit(handleGenerate)}>
        <Paper sx={{ marginTop: "32px" }}>
          <Stack padding="24px" spacing="24px">
            <FormControl fullWidth>
              <Controller
                control={control}
                name="count"
                defaultValue={1}
                rules={{
                  required: t("errors.required.field", { field: "Count" }),
                  min: {
                    value: 1,
                    message: t("errors.min", { field: "Count", value: 1 }),
                  },
                  max: {
                    value: 100,
                    message: t("errors.max", { field: "Count", value: 100 }),
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    variant="outlined"
                    id="count"
                    label={t("qrcodes.fields.count")}
                    inputProps={{
                      min: 1,
                      max: 100,
                    }}
                    error={!!errors.count}
                    helperText={errors.count?.message}
                  />
                )}
              />
            </FormControl>
          </Stack>
        </Paper>
        <Stack
          direction="row"
          justifyContent="space-between"
          padding="16px 24px"
        >
          <Button variant="text" color="inherit" onClick={onDrawerClose}>
            {t("buttons.cancel")}
          </Button>
          {action === "edit" && id && (
            <DeleteButton
              resource="qrcodes"
              recordItemId={id}
              variant="contained"
              onSuccess={onDrawerClose}
            />
          )}
          <Button type="submit" variant="contained">
            {t("buttons.generate")}
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
