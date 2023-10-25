import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import { Alert, Breadcrumbs, Link, MenuItem, Stack, TextField } from "@mui/material";
import { Link as HrefLink } from "react-router-dom";
import { API } from "../api";
import AceEditor from "react-ace";
import { utils, write } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-inline_autocomplete";
import "ace-builds/src-noconflict/ext-code_lens";
import Sidebar from "../components/Sidebar";

export default function GenerateData() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("user-apiKey") || ""
  );
  const [structure, setStructure] = useState({});
  const [arrayLength, setArrayLength] = useState("");
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState("");

  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, key) => {
      const propKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        return { ...acc, ...flattenObject(obj[key], propKey) };
      } else {
        return { ...acc, [propKey]: obj[key] };
      }
    }, {});
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const flattenedData = data.map((item) => flattenObject(item));

    const columns = Object.keys(flattenedData[0]);
    const rows = flattenedData.map((item) => {
      return columns.map((column) => item[column]);
    });

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("generated_data.pdf");
  };

  const generateCSV = () => {
    // Flatten the data
    const flattenedData = data.map((item) => flattenObject(item));

    // Define the CSV columns (keys of the first item)
    const columns = Object.keys(flattenedData[0]);

    // Map data to CSV rows
    const rows = flattenedData.map((item) => {
      return columns.map((col) => item[col]);
    });

    // Insert the CSV header
    rows.unshift(columns);

    // Convert rows to CSV string
    const csv = Papa.unparse(rows);

    // Create a Blob and download the file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "generated_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcel = () => {
    const flattenedData = data.map((item) => flattenObject(item));

    const worksheet = utils.json_to_sheet(flattenedData);

    // Calculate column widths based on content length
    const colWidths = flattenedData.reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        const length = item[key] ? item[key].toString().length : 0;
        acc[key] = Math.max(acc[key] || 0, length);
      });
      return acc;
    }, {});

    worksheet["!cols"] = Object.keys(colWidths).map((key) => ({
      wch: colWidths[key] + 2, // Add some extra width for padding
    }));

    const workbook = {
      Sheets: { Sheet1: worksheet },
      SheetNames: ["Sheet1"],
    };

    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "generated_data.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: API.GEN_DATA,
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      data: JSON.stringify({
        structure: JSON.parse(structure),
        arrayLength: arrayLength,
      }),
    };
    try {
      const response = await axios.request(config);
      setData(response.data);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message);
      console.error("Error sending request:", error);
    }
  };

  const generateFile = (format) => {
    if (format === "excel") {
      generateExcel();
    } else if (format === "csv") {
      generateCSV();
    } else if (format === "pdf") {
      generatePDF();
    }
  };

  const handleApiKey = (value) => {
    setApiKey(value);
    localStorage.setItem("user-apiKey", value);
  };
  return (
    <Container maxWidth="lg">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={HrefLink} to="/">
          Home
        </Link>
        <Typography color="text.primary">Generate Data</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Stack direction="row" my={2} spacing={3} alignItems={"center"}>
          <Typography variant="h4" component="h1" mb={0} gutterBottom>
            Generate Data
          </Typography>
          <Sidebar />
        </Stack>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert
              severity="error"
              sx={{
                my: 2,
              }}
            >
              {error}
            </Alert>
          )}
          <TextField
            type="text"
            label="API Key"
            value={apiKey}
            onChange={(e) => handleApiKey(e.target.value)}
            fullWidth
            required
            variant="outlined"
            color="success"
            sx={{ mb: 2 }}
          />
          <AceEditor
            mode="json"
            theme="solarized_light"
            name="blah2"
            onChange={(e) => {
              setStructure(e);
            }}
            fontSize={14}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            width="100%"
          />
          <TextField
            type="number"
            placeholder="Array Length"
            value={arrayLength}
            onChange={(e) => setArrayLength(e.target.value)}
            fullWidth
            required
            sx={{ my: 2 }}
          />
          <Box
            display={"flex"}
            gap={2}
            width={"100%"}
            alignItems={"center"}
            mb={2}
          >
            <Button variant="contained" type="submit">
              Generate Data
            </Button>
            {success && (
              <TextField
                select
                label="Download Format"
                value={downloadFormat}
                onChange={(e) => generateFile(e.target.value)}
                sx={{
                  minWidth: 200,
                }}
                variant="outlined"
                color="success"
                size="small"
              >
                <MenuItem value="">Select Format to download</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </TextField>
            )}
          </Box>
        </form>

        {success && (
          <AceEditor
            mode="json"
            theme="tomorrow"
            name="blah22"
            value={JSON.stringify(data, null, 2)}
            fontSize={14}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            readOnly
            width="100%"
            sx={{ mt: 4 }}
          />
        )}
      </Box>
    </Container>
  );
}
