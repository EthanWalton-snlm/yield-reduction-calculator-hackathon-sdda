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
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import html2pdf from "html2pdf.js";

export function SummaryTable({ contentRef, data }) {
  const { mode, setMode } = useColorScheme();
  const handleDownload = async () => {
    const element = contentRef.current;

    const isDark = mode === "dark";
    if (isDark) setMode("light");

    const options = {
      margin: 1,
      filename: "yield_calculation.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    await html2pdf().set(options).from(element).save();

    if (isDark) setMode("dark");
  };

  return (
    <Box id="content">
      <Button onClick={handleDownload} endDecorator={<PictureAsPdfSharpIcon />}>
        Download{" "}
      </Button>
      <Box ref={contentRef}>
      <Sheet sx={{
        width: '50%',
        margin: '0 auto',
        display: 'block'
      }}>
      <Table cellPadding="10" cellSpacing="0"  aria-label="table with sticky header"
          stickyHeader
          stickyFooter
          stripe="odd"
          hoverRow

          sx={{
            border: '1px solid #e0e4e9',
            borderRadius: '8px',
            overflow: 'hidden',
            '& thead th': {
              backgroundColor: '#2374bb',
              color: 'white',
              fontWeight: 'bold',
              fontSize:'16px'
            },
            '& tbody td': {
              border: '1px solid #e0e0e0',
              borderTop: 'none',
            },
            '& tbody tr:nth-child(odd) td': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f0f4f8',
              color: mode === 'dark' ? 'white' : 'inherit',
            },
            '& tbody td:nth-child(2)': {
              fontWeight: 'bold',

            },
            '& tbody tr:nth-last-child(2) td': {
              fontWeight: 'bold',
              backgroundColor: mode === 'dark' ? '#2374bb' : '#9fb9d4',
              color: mode === 'dark' ? 'white' : 'inherit',

            },
            '& tbody tr:last-child td': {
              borderBottom: 'none',
              fontWeight: 'bold',
              backgroundColor: '#f0f4f8',
              backgroundColor: mode === 'dark' ? '#2374bb' : '#9fb9d4',
              color: mode === 'dark' ? 'white' : 'inherit',
            }
          }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            Object.entries(data)
              .filter(([key]) => key !== 'aiResponse') // Exclude AI response from table
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
          mt: 3,
          width: '100%',
          backgroundColor: '#f8fafc'
        }}
      >
        <CardContent>
          <Typography
            level="h4"
            sx={{
              mb: 2,
              color: '#2374bb',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🤖 AI Financial Analysis
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography
            level="body-md"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}
          >
            {data.aiResponse}
          </Typography>
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
