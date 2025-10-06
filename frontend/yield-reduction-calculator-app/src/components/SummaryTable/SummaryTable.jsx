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

export function SummaryTable({ contentRef, data }) {
  return (
    <Box ref={contentRef} id="content">
      <table cellPadding="10" cellSpacing="0">
        <tbody>
          {Object.entries(data).map(([key, value], index) => (
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
