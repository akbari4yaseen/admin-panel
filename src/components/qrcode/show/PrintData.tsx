// PrintData.tsx
import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

type PrintDataProps = {
  data: string;
};

const PrintData = ({ data }: PrintDataProps) => {
  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom></Typography>
      <img src={data} alt="QR Code" />
    </Box>
  );
};

export const ForwardedPrintData = forwardRef<HTMLDivElement, PrintDataProps>(
  ({ data }, ref) => {
    return (
      <div ref={ref}>
        <PrintData data={data} />
      </div>
    );
  }
);

ForwardedPrintData.displayName = "ForwardedPrintData";
