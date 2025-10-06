import {
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Box,
  Textarea,
} from "@mui/joy";

export function CalculatorInput({ title, value, setValue }) {
  return (
    <>
      <Typography className="age">{title}</Typography>
      <Box className="textfield-wrapper">
        <Box className="textfield-container space">
          <Textarea
            color="neutral"
            disabled={false}
            minRows={2}
            placeholder="R"
            size="md"
            className="textfield"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></Textarea>
        </Box>
      </Box>
    </>
  );
}
