"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid2 as Grid,
  Link,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Download as DownloadIcon } from "@mui/icons-material";

import { DeviceProps } from "@/types/devices";

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Paper = styled(MuiPaper)(spacing);

const headCells: Array<{ id: string; alignment: "left" | "center" | "right"; label: string }> = [
  { id: "deviceName", alignment: "left", label: "Device Name" },
  { id: "lab", alignment: "left", label: "Lab" },
  { id: "apiKey", alignment: "left", label: "API" },
  { id: "actions", alignment: "center", label: "" },
];

function DeviceTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [apikeys, setApikeys] = useState<Array<{ api: string; labId: number }>>([]);
  const [deviceData, setDeviceData] = useState<
    { deviceName: string; labId: number; apiKey: string }[]
  >([]);

  useEffect(() => {
    async function fetchApikeys() {
      try {
        const response = await fetch(`/api/apikeys_getall`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setApikeys(data);
      } catch (error) {
        console.error("Error fetching apikeys:", error);
      }
    }

    fetchApikeys();
  }, []);

  useEffect(() => {
    const fetchDataFromApi = async (apikey: string) => {
      try {
        const response = await fetch(`${apikey}?results=0`);
        if (!response.ok) throw new Error(`Fetch error for ${apikey}`);
        return await response.json();
      } catch (error) {
        console.error("API Fetch Error:", error);
        return null;
      }
    };

    const fetchAllData = async () => {
      const results = await Promise.all(apikeys.map((key) => fetchDataFromApi(key.api)));
      const filteredResults = results.filter(Boolean);
      const newDeviceData = filteredResults.map((res, index) => ({
        deviceName: res.channel?.name ?? `Unknown Device ${index + 1}`,
        labId: apikeys[index].labId,
        apiKey: apikeys[index].api,
      }));
      setDeviceData(newDeviceData);
    };

    if (apikeys.length > 0) {
      fetchAllData();
    }
  }, [apikeys]);

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDownload = async (device: {
    deviceName: string;
    labId: number;
    apiKey: string;
  }) => {
    try {
      const url = `${device.apiKey}?results=1000`; // You can customize result count
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
  
      const data = await response.json();
  
      const feeds = data.feeds;
      if (!feeds || feeds.length === 0) {
        alert("No data available to download.");
        return;
      }
  
      // Extract field names from first item
      const fieldKeys = Object.keys(feeds[0]).filter((key) =>
        key.startsWith("field") || key === "created_at"
      );
  
      // Build CSV content
      const csvRows: string[] = [
        ["created_at", ...fieldKeys.filter((f: string) => f !== "created_at")].join(","), // header
        ...feeds.map((entry: Record<string, any>) =>
          [
            entry.created_at,
            ...fieldKeys.filter((f: string) => f !== "created_at").map((field: string) => entry[field] || "")
          ].join(",")
        ),
      ];
  
      const csvContent = csvRows.join("\n");
  
      // Create and download blob
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const urlBlob = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", `${device.deviceName.replace(/\s+/g, "_")}_data.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download data. See console for more info.");
    }
  };

  const pagedRows = deviceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((head) => (
                <TableCell key={head.id} align={head.alignment}>
                  {head.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.deviceName}</TableCell>
                <TableCell>{`Lab ${row.labId}`}</TableCell>
                <TableCell>{row.apiKey}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Download">
                    <IconButton onClick={() => handleDownload(row)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        count={deviceData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

function DeviceListPage() {
  return (
    <>
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Device List
          </Typography>
          <Breadcrumbs mt={2}>
            <Link component={NextLink} href="/">
              Dashboard
            </Link>
            <Typography>Devices</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Divider my={6} />
      <DeviceTable />
    </>
  );
}

export default DeviceListPage;