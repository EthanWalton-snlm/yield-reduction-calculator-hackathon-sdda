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
          className="textfield"
            endDecorator="%"
             type="number"
             variant="soft"
             defaultValue={value * 100}
             slotProps={{
                input: {
                min: 0,
                max: 100,
                step: 0.001,
                },
            }}
            onChange={(e) => setValue(e.target.value / 100)}
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
