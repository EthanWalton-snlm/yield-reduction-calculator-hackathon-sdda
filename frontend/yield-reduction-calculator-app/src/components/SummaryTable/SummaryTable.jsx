import {
  Input,
  Option,
  Select,
  Box,
  Typography,
  Textarea,
  Button,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Sheet,
  Table,
  Card,
  CardContent,
  Divider,
} from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";

export function SummaryTable({ contentRef, data, mode }) {
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

  return (
    <Box id="content">
      <Box ref={contentRef} className="summary-table">
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
              borderRadius: "8px",
              overflow: "hidden",
              "& thead th": {
                backgroundColor: "#2374bb",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
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
                fontWeight: "bold",
                backgroundColor: mode === "dark" ? "#2374bb" : "#9fb9d4",
                color: mode === "dark" ? "white" : "inherit",
              },
              "& tbody tr:last-child td": {
                borderBottom: "none",
                fontWeight: "bold",
                backgroundColor: mode === "dark" ? "#2374bb" : "#9fb9d4",
                color: mode === "dark" ? "white" : "inherit",
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
                Object.entries(data)
                  .filter(([key]) => key !== "aiResponse") // Exclude AI response from table
                  .map(([key, value], index) => (
                    <tr key={index}>
                      <td>{formatKey(key).toUpperCase()}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        </Sheet>

        {/* AI Response Card */}
        {data?.aiResponse && data.aiResponse !== "AI OVERVIEW DISABLED" && (
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              backgroundColor:
                mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
              borderColor:
                mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#f8fafc",
              border: "1px solid #e0e4e9",
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
                {formatAIResponse(data.aiResponse)}
              </Box>
            </CardContent>
          </Card>
        )}
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
