import { Typography, Select, Option, Box } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";

export function WrapperTypeDropdown({
  title = "Wrapper Type",
  value,
  setValue,
}) {
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
          <Select
            variant="soft"
            id="wrapperType"
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            placeholder="Endowment"
            className="textfield"
            sx={{
              minHeight: 20,
              paddingY: 1,
              gap: 1,
              color: mode === "dark" ? "#f0f0f0" : "inherit",
              backgroundColor: mode === "dark" ? "#333333" : "inherit",
              "& input": {
                padding: "2px 6px",
              },
            }}
          >
            <Option value="Endowment">Endowment</Option>
            <Option value="RA">RA</Option>
            <Option value="TFSA">TFSA</Option>
            <Option value="Offshore Endowment">Offshore Endowment</Option>
            <Option value="Local or Foreign Note">Local or Foreign Note</Option>
          </Select>
        </Box>
      </Box>
    </>
  );
}
