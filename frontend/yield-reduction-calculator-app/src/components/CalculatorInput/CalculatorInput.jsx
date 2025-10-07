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

export function CalculatorInput({ title, value, setValue }) {

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const initialValue = inputValue.replace(/\D/g, '');
    setValue(initialValue);
  };

  const { mode } = useColorScheme();

  return (
    <>
      <Typography className="age">{title}</Typography>
      <Box className="textfield-wrapper">
        <Box className="textfield-container space">
          <Input
            type="text"
            startDecorator="R"
            color="neutral"
            disabled={false}
            placeholder="0"
            className="textfield"
            value={(value || '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={handleChange}
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
  );
}
