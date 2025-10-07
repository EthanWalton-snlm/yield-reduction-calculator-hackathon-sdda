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
      <Sheet sx={{
        width: '50%',
        margin: '0 auto',
        display: 'block'
      }}>
      <Table cellPadding="10" cellSpacing="0" ref={contentRef} aria-label="table with sticky header"
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
              backgroundColor: '#f0f4f8',
            },
            '& tbody td:nth-child(2)': {
              fontWeight: 'bold',

            },
            '& tbody tr:nth-last-child(2) td': {
              fontWeight: 'bold',

            },
            '& tbody tr:last-child td': {
              borderBottom: 'none',
              fontWeight: 'bold',
              backgroundColor: '#f0f4f8',
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
            Object.entries(data).map(([key, value], index) => (
              <tr key={index}>
                <td>{formatKey(key).toUpperCase()}</td>
                <td>{value}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Sheet>
    </Box>
  );
}

function formatKey(key) {
  // convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}
