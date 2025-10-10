import {
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Box,
  Textarea,
  Input,
} from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";

export function AgeSpineditInput({ title, value, setValue }) {
  const { mode } = useColorScheme();
  return (
    <>
      <Typography
        className="age"
        sx={{ color: mode === "dark" ? "#f0f0f0" : "inherit" }}
      >
        {title}
      </Typography>
      <Box className="textfield-wrapper">
        <Box className="textfield-container space">
          <Input
            className="textfield"
            type="number"
            variant="soft"
            defaultValue={18}
            slotProps={{
              input: {
                min: 18,
                max: 100,
                step: 1,
              },
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{
              minHeight: 20,
              paddingY: 1,
              gap: 1,
              backgroundColor: mode === "dark" ? "#333333" : "inherit",
              color: mode === "dark" ? "#f0f0f0" : "inherit",
              "& input": {
                padding: "2px 6px",
              },
            }}
          ></Input>
        </Box>
      </Box>
    </>
  );
}
