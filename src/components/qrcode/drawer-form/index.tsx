import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  useApiUrl,
  useGetToPath,
  useGo,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { DeleteButton } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import {
  Button,
  CircularProgress,
  FormControl,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import { Drawer, DrawerHeader } from "../../../components";
import { axiosInstance } from "../../../utils";

type Props = {
  action: "create" | "edit";
  open: boolean;
  onClose: () => void;
};

export const QRcodeDrawerForm = ({ action, open, onClose }: Props) => {
  const t = useTranslate();
  const go = useGo();
  const apiUrl = useApiUrl();
  const notify = useNotification();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    refineCore: { id, formLoading },
  } = useForm({
    defaultValues: { count: 1 },
    refineCoreProps: {
      resource: "qrcodes",
      redirect: false,
      onMutationSuccess: () => onDrawerClose(),
    },
  });

  const navigationTarget = useMemo(() => {
    return searchParams.get("to") ?? getToPath({ action: "list" }) ?? "";
  }, [searchParams, getToPath]);

  const onDrawerClose = useCallback(() => {
    onClose();
    go({
      to: navigationTarget,
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  }, [go, onClose, navigationTarget]);

  const handleGenerate = async ({ count }: { count: number }) => {
    setLoading(true);
    try {
      await axiosInstance.post(`${apiUrl}/generates`, {
        count: Number(count),
      });

      notify?.open?.({
        type: "success",
        message: t("qrcodes.success.generate"),
      });

      onDrawerClose();
    } catch (error) {
      notify?.open?.({
        type: "error",
        message: error instanceof Error ? error.message : t("errors.generic"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={onDrawerClose}
      PaperProps={{ sx: { width: { sm: "100%", md: "416px" } } }}
    >
      <DrawerHeader
        title={
          action === "create"
            ? t("qrcodes.actions.add")
            : t("qrcodes.actions.edit")
        }
        onCloseClick={onDrawerClose}
      />
      <form onSubmit={handleSubmit(handleGenerate)}>
        <Paper sx={{ mt: 4 }}>
          <Stack p={3} spacing={3}>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="count"
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
                    id="count"
                    variant="outlined"
                    label={t("qrcodes.fields.count")}
                    inputProps={{ min: 1, max: 100 }}
                    error={!!errors.count}
                    helperText={errors.count?.message}
                  />
                )}
              />
            </FormControl>
          </Stack>
        </Paper>
        <Stack direction="row" justifyContent="space-between" p={2}>
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

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? t("buttons.generating") : t("buttons.generate")}
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
