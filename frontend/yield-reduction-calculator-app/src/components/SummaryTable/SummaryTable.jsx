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
      filename: "test.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    await html2pdf().set(options).from(element).save();

    if (isDark) setMode("dark");
  };

  return (
    <Box ref={contentRef} id="content">
      <Button onClick={handleDownload} endDecorator={<PictureAsPdfSharpIcon />}>
        Download{" "}
      </Button>
      <table cellPadding="10" cellSpacing="0">
        <tbody>
          {data &&
            Object.entries(data).map(([key, value], index) => (
              <tr key={index}>
                <td>{formatKey(key)}</td>
                <td>{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Box>
  );
}

function formatKey(key) {
  // convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}
