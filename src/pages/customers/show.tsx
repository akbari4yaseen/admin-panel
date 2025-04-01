import React from "react";
import { useGetToPath, useGo, useShow, useTranslate } from "@refinedev/core";
import { useSearchParams } from "react-router";

import { DateField } from "@refinedev/mui";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import type { IUser } from "../../interfaces";
import { CustomerStatus, Drawer, DrawerHeader } from "../../components";

export const CustomerShow = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();

  const { query: queryResult } = useShow<IUser>();
  const user = queryResult.data?.data;

  const onDrawerCLose = () => {
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

  return (
    <Drawer
      open
      onClose={onDrawerCLose}
      anchor="right"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "736px",
        },
      }}
    >
      <DrawerHeader onCloseClick={onDrawerCLose} />
      <Stack spacing="32px" padding="32px 32px 56px 32px">
        <Stack spacing="28px" direction="row" alignItems="center">
          <Avatar
            sx={{
              width: "72px",
              height: "72px",
            }}
            src={user?.avatar?.[0]?.url}
            alt={user?.fullName}
          />
          <Stack>
            <Typography color="text.secondary" fontWeight="700">
              #{user?.id}
            </Typography>
            <Typography variant="h5">{user?.fullName}</Typography>
          </Stack>
        </Stack>

        <Paper>
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <LocalPhoneOutlinedIcon color="primary" />
              <Typography>{t("users.fields.gsm")}</Typography>
            </Stack>
            <Typography>{user?.gsm}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="flex-start" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <PlaceOutlinedIcon color="primary" />
              <Typography>{t("users.fields.addresses")}</Typography>
            </Stack>
            <Stack spacing="12px">
              {user?.addresses.map((address, index) => {
                const isFirst = index === 0;

                const icon = isFirst ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <ArrowCircleRightOutlinedIcon color="action" />
                );
                return (
                  <Stack direction="row" spacing="8px" key={address.text}>
                    {icon}
                    <Typography>{address.text}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <LocalPhoneOutlinedIcon color="primary" />
              <Typography>{t("users.fields.isActive.label")}</Typography>
            </Stack>
            <CustomerStatus size="small" value={!!user?.isActive} />
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <LocalPhoneOutlinedIcon color="primary" />
              <Typography>{t("users.fields.createdAt")}</Typography>
            </Stack>
            <DateField value={user?.createdAt} format="MMMM, YYYY / HH:mm A" />
          </Stack>
        </Paper>
      </Stack>
    </Drawer>
  );
};
