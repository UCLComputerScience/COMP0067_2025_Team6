"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Search as SearchIcon } from "@mui/icons-material";
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
  TextField,
  Button,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Download as DownloadIcon, Add as AddIcon } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

let exportToPDFFunction = () => {};

function DeviceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [apikeys, setApikeys] = useState<Array<{ api: string; labId: number }>>([]);
  const [deviceData, setDeviceData] = useState<{ deviceName: string; labId: number; apiKey: string }[]>([]);

  useEffect(() => {
    async function fetchApikeys() {
      try {
        const response = await fetch("/api/apikeys_getall");
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

  const handleDownload = async (device: { deviceName: string; labId: number; apiKey: string }) => {
    try {
      const url = `${device.apiKey}?results=1000`;
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

      const fieldKeys = Object.keys(feeds[0]).filter((key) =>
        key.startsWith("field") || key === "created_at"
      );

      const csvRows: string[] = [
        ["created_at", ...fieldKeys.filter((f: string) => f !== "created_at")].join(","),
        ...feeds.map((entry: Record<string, any>) =>
          [
            entry.created_at,
            ...fieldKeys.filter((f: string) => f !== "created_at").map((field: string) => entry[field] || ""),
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
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

  const filteredRows = deviceData.filter(
    (row) =>
      row.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Lab ${row.labId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pagedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = filteredRows.map((row) => ({
      deviceName: row.deviceName,
      lab: `Lab ${row.labId}`,
      apiKey: row.apiKey,
    }));

    doc.setFontSize(16);
    doc.text("Device List Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    let yPosition = 35;
    doc.setFontSize(10);
    const activeFilters = [];

    if (searchTerm) activeFilters.push(`Search Term: "${searchTerm}"`);
    if (activeFilters.length > 0) {
      doc.text("Applied Filters:", 14, yPosition);
      activeFilters.forEach((filter, index) => {
        yPosition += 5;
        doc.text(`• ${filter}`, 16, yPosition);
      });
      yPosition += 10;
    }

    autoTable(doc, {
      columns: [
        { header: "Device Name", dataKey: "deviceName" },
        { header: "Lab", dataKey: "lab" },
        { header: "API", dataKey: "apiKey" },
      ],
      body: data,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 117, 163] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("device-list.pdf");
  };
  exportToPDFFunction = exportToPDF;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <TextField
          placeholder="Search Device/Lab"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <Paper>
        <TableContainer sx={{ borderBottom: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ width: "30%" }}>
                  Device Name
                </TableCell>
                <TableCell align="left" sx={{ width: "30%" }}>
                  Lab
                </TableCell>
                <TableCell align="left" sx={{ width: "40%" }}>
                  API
                </TableCell>
                <TableCell align="center" sx={{ width: "5%", whiteSpace: "nowrap" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ width: "30%" }}>{row.deviceName}</TableCell>
                  <TableCell sx={{ width: "30%" }}>{`Lab ${row.labId}`}</TableCell>
                  <TableCell sx={{ width: "40%" }}>{row.apiKey}</TableCell>
                  <TableCell align="center" sx={{ width: "5%" }}>
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
          component="div"
          rowsPerPageOptions={[6, 12, 18]}
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "none",
            marginTop: 0,
            paddingTop: 0,
          }}
        />
      </Paper>
    </>
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
        <Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportToPDFFunction()}
            startIcon={<AddIcon />}
          >
            Export
          </Button>
        </Grid>
      </Grid>
      <Divider my={6} />
      <DeviceTable />
    </>
  );
}

export default DeviceListPage;