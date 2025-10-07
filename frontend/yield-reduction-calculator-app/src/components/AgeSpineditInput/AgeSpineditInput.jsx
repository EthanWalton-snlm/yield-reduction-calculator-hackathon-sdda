import {
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Box,
  Textarea,
  Input
} from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";

export function AgeSpineditInput({ title, value, setValue }) {
  const { mode } = useColorScheme();
    return(
    <>
      <Typography className="age">{title}</Typography>
      <Box className="textfield-wrapper">
        <Box className="textfield-container space">
          <Input
          className="textfield"
             type="number"
             variant="soft"
             defaultValue={0}
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
              backgroundColor: mode === 'dark' ? '#333333' : 'inherit',
              '& input': {
              padding: '2px 6px',
              }}}

          ></Input>
        </Box>
      </Box>
    </>
    )
}
