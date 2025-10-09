import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Sheet,
  Table,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/joy";
import axios from "axios";
import logo from './image.png';

export function SummaryTable({ contentRef, data, mode, downloadTimeStamp, isGeneratingPdf }) {
  const [aiResponseData, setAiResponseData] = useState(false);
  const [aiLoading, setAiLoading] = useState(true);

  // Function to format AI response with styled headings
  const formatAIResponse = (text) => {
    return text.split("\n").map((line, index) => {
      const trimmed = line.trim();

      // Headers (lines starting with ##, ###, etc.)
      if (trimmed.startsWith("##")) {
        return (
          <Typography
            key={index}
            level="h5"
            sx={{
              mt: 2,
              mb: 1,
              color: mode === "dark" ? "black" : "#2374bb",
              fontWeight: "bold",
            }}
          >
            {trimmed.replace(/^#+\s*/, "")}
          </Typography>
        );
      }

      // Numbered headers (1. **Header**, 2. **Header**, etc.)
      if (/^\d+\.\s*\*\*.*\*\*/.test(trimmed)) {
        const title = trimmed.replace(/^\d+\.\s*\*\*(.*?)\*\*.*/, "$1");
        return (
          <Typography
            key={index}
            level="h5"
            sx={{
              mt: 2,
              mb: 1,
              color: mode === "dark" ? "#fff" : "#333",
              fontWeight: "bold",
              borderBottom: "1px solid",
              borderColor: mode === "dark" ? "#fff" : "#333",
              pb: 0.5,
            }}
          >
            {trimmed.match(/^\d+\./)[0]} {title}
          </Typography>
        );
      }

      // Bold text (**text**)
      if (trimmed.includes("**")) {
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <Typography key={index} level="body-md" sx={{ mb: 1 }}>
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <Box
                  component="span"
                  key={i}
                  sx={{
                    fontWeight: "bold",
                    color: mode === "dark" ? "#fff" : "#333",
                  }}
                >
                  {part.slice(2, -2)}
                </Box>
              ) : (
                part
              )
            )}
          </Typography>
        );
      }

      // Regular text
      if (trimmed) {
        return (
          <Typography
            key={index}
            level="body-md"
            sx={{
              mb: 1,
              color: mode === "dark" ? "#e0e0e0" : "#555",
            }}
          >
            {trimmed}
          </Typography>
        );
      }

      // Empty line
      return <Box key={index} sx={{ height: "8px" }} />;
    });
  };

  useEffect(() => {
    let mounted = true;

    const fetchAIResponse = async () => {
      try {
        const response = await axios.get("http://localhost:5000/ai-overview");
        if (mounted) {
          setAiResponseData(response.data.aiResponse || "");
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        if (mounted) setAiLoading(false);
      }
    };

    fetchAIResponse();

    return () => {
      mounted = false; // cancel if component unmounts
    };
  }, []);

  return (
    <Box id="content" ref={contentRef}>
      {isGeneratingPdf && downloadTimeStamp && (
            <Box
            className="pdf-header"
             >
               <img
              src={logo}
              alt=""
              className="logo"
            ></img>
              Generated: {downloadTimeStamp}
            </Box>
          )}
      <Box className="summary-table">
        <Sheet
          sx={{
            width: "50%",
            margin: "0 auto",
            display: "block",
          }}
        >
          <Table
            cellPadding="10"
            cellSpacing="0"
            aria-label="table with sticky header"
            stickyHeader
            stickyFooter
            stripe="odd"
            hoverRow
            sx={{
              border: "1px solid #e0e4e9",
              borderRadius: "4px",
              overflow: "hidden",
              "& thead th": {
                backgroundColor: "#0075c9",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                verticalAlign: "middle",
              },
              "& tbody td": {
                border: "1px solid #e0e0e0",
                borderTop: "none",
              },
              "& tbody tr:nth-child(odd) td": {
                backgroundColor:
                  mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#f0f4f8",
                color: mode === "dark" ? "white" : "inherit",
              },
              "& tbody td:nth-child(2)": {
                fontWeight: "bold",
              },
              "& tbody tr:nth-last-child(2) td": {
                fontWeight: "600",
                backgroundColor: "#0075c9",
                color: "#fff",
              },
              "& tbody tr:last-child td": {
                borderBottom: "none",
                fontWeight: "600",
                backgroundColor: "#0075c9",
                color: "#fff",
              },
            }}
          >
            <thead>
              <tr>
                <th>Description</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                Object.entries(data).map(([key, value], index) => (
                  <tr key={index}>
                    <td>{formatKey(key)}</td>
                    <td>{formatValue(key, value)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Sheet>

        {/* AI Response Card */}
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            backgroundColor:
              mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
            borderColor:
              mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#f8fafc",
            border: "1px solid #e0e4e9",
            borderRadius: "4px",
          }}
        >
          <CardContent>
            <Typography
              level="h4"
              sx={{
                mb: 2,
                color: mode === "dark" ? "#7db3e8" : "#2374bb",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              AI Financial Analysis
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                "& > *": { lineHeight: 1.6 },
                fontSize: "0.95rem",
              }}
            >
              {aiLoading ? (
                <Box className="loading" sx={{ mt: "3em" }}>
                  <CircularProgress size="md" />
                  <Typography>{"Generating AI Overview..."}</Typography>
                </Box>
              ) : (
                formatAIResponse(aiResponseData)
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function formatKey(key) {
  // convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}

function formatValue(key, value) {
  // Convert camelCase to uppercase with spaces to match array
  const newKey = formatKey(key).toUpperCase();

  const unformatDecimals = [
    "CLIENTS MARGINAL INCOME TAX RATE",
    "GROSS PORTFOLIO RETURN",
    "NET RETURN UNWRAPPED PERCENTAGE",
    "NET RETURN WRAPPED PERCENTAGE",
    "WRAPPER COST",
    "YIELD REDUCTION ENHANCEMENT PERCENT",
  ];

  if (!unformatDecimals.includes(newKey) && value === 0) {
    return "R0.00";
  }

  if (unformatDecimals.includes(newKey)) {
    const percentValue = Number(value) * 100;
    // Check if it's a whole number (no decimal places)
    if (percentValue === Math.floor(percentValue)) {
      return `${Math.floor(percentValue)}%`;
    } else {
      return `${percentValue.toFixed(3)}%`;
    }
  } else {
    const numericValue = Number(value) || 0;
    return `R${numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
