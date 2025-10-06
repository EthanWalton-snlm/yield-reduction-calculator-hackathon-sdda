import { Typography, Select, Option } from "@mui/joy";

export function WrapperTypeDropdown({
  title = "Wrapper Type",
  value,
  setValue,
}) {
  return (
    <>
      <Typography className="age">{title}</Typography>
      <Select
        variant="soft"
        className="options space"
        id="wrapperType"
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        placeholder="Endowment"
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
