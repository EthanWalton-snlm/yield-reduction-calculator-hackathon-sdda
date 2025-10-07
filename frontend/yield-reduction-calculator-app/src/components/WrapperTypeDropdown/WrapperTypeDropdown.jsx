import { Typography, Select, Option } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";

export function WrapperTypeDropdown({
  title = "Wrapper Type",
  value,
  setValue,
}) {

  const { mode } = useColorScheme();

  return (
    <>
      <Typography className="age"
       sx={{color: mode === 'dark' ? '#f0f0f0' : 'inherit'}}>{title}</Typography>
      <Select
        variant="soft"
        className="options space"
        id="wrapperType"
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        placeholder="Endowment"
        sx={{backgroundColor: mode === 'dark' ? '#333333' : 'inherit',
          color: mode === 'dark' ? '#f0f0f0' : 'inherit'
        }}
      >
        <Option value="Endowment">Endowment</Option>
        <Option value="RA">RA</Option>
        <Option value="TFSA">TFSA</Option>
        <Option value="Offshore Endowment">Offshore Endowment</Option>
        <Option value="Local or Foreign Note">Local or Foreign Note</Option>
      </Select>
    </>
  );
}
