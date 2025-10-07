import { Typography, Box, Input } from "@mui/joy";
import { useState, useEffect } from "react";
import { useColorScheme } from "@mui/joy/styles";

export function SpineditInput({ title, value, setValue }) {
  const [displayValue, setDisplayValue] = useState((value * 100).toFixed(2));

  useEffect(() => {
    setDisplayValue((value * 100).toFixed(2));
  }, [value]);

  const handleChange = (e) => {
    const input = e.target.value;
    setDisplayValue(input);
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      setValue(parsed / 100);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(displayValue);
    if (!isNaN(parsed)) {
      setDisplayValue(parsed.toFixed(2));
    }
  };
  const { mode } = useColorScheme();

  return (
    <>
      <Typography className="age"
       sx={{color: mode === 'dark' ? '#f0f0f0' : 'inherit'}}>{title}</Typography>
      <Box className="textfield-wrapper">
        <Box className="textfield-container space">
          <Input
            className="textfield"
            endDecorator="%"
            type="number"
            variant="soft"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            slotProps={{
              input: {
                min: 0,
                max: 100,
                step: 0.01,
              },
            }}
            sx={{
              minHeight: 20,
              paddingY: 1,
              gap: 1,
              backgroundColor: mode === 'dark' ? '#333333' : 'inherit',
              color: mode === 'dark' ? '#f0f0f0' : 'inherit',
              "& input": {
                padding: "2px 6px",
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}
