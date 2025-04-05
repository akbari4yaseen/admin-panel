import React, { type PropsWithChildren, useState } from "react";
import { CreateButton } from "@refinedev/mui";

import {
  RefineListView,
  QRcodeListTable,
  QRcodeListCard,
  QRcodeDrawerForm,
} from "../../components";
import { useTranslate, useNavigation } from "@refinedev/core";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";

import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

interface IQRCode {
  id: number;
  token: string;
  url: string;
  image: string;
  valid: boolean;
  created_at: string;
}

type View = "table" | "card";

export const QRCodeList: React.FC<PropsWithChildren> = ({ children }) => {
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("qrcodes-view") as View;
    return view || "table";
  });

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const { replace } = useNavigation();
  const t = useTranslate();

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View
  ) => {
    // remove query params (pagination, filters, etc.) when changing view
    replace("");

    setView(newView);
    localStorage.setItem("qrcodes-view", newView);
  };

  return (
    <>
      <RefineListView
        headerButtons={(props) => [
          <ToggleButtonGroup
            key="view-toggle"
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="text alignment"
          >
            <ToggleButton value="table" aria-label="table view" size="small">
              <ListOutlinedIcon />
            </ToggleButton>
            <ToggleButton value="card" aria-label="card view" size="small">
              <BorderAllOutlinedIcon />
            </ToggleButton>
          </ToggleButtonGroup>,
          <CreateButton
            {...props.createButtonProps}
            key="create"
            size="medium"
            sx={{ height: "40px" }}
            onClick={() => setCreateDrawerOpen(true)}
          >
            {t("qrcodes.actions.add")}
          </CreateButton>,
        ]}
      >
        {view === "table" && <QRcodeListTable />}
        {view === "card" && <QRcodeListCard />}
      </RefineListView>

      <QRcodeDrawerForm
        open={createDrawerOpen}
        action="create"
        onClose={() => setCreateDrawerOpen(false)}
      />

      {children}
    </>
  );
};
