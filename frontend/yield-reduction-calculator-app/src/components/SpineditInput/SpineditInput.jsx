import {
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Box,
  Textarea,
  Input
} from "@mui/joy";

export function SpineditInput({ title, value, setValue }) {
    return(
    <>
      <Typography className="age">{title}</Typography>
      <Box className="textfield-wrapper">
        <Box className="textfield-container space">
          <Input
             type="number"
             variant="soft"
             defaultValue={0}
             slotProps={{
                input: {
                min: 0,
                max: 100,
                step: 0.001,
                },
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{
              minHeight: 20,
              paddingY: 1,
              gap: 1,
              '& input': {
              padding: '2px 6px',
              }}}

          ></Input>
        </Box>
      </Box>
    </>
    )
}
