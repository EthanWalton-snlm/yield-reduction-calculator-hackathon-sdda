import { Box, Typography } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";

export function ResultBox({
  title,
  value,
  isPercent = false,
  isCurrency = false,
}) {
  const { mode } = useColorScheme();
  return (
    <Box className="results-box">
      <Typography
        level="h3"
        sx={{ fontWeight: "md", mb: 1,
          color: mode === 'dark' ? '#f0f0f0' : 'inherit',
        }}
      >
        {title}
      </Typography>
      <Box className="underline-long"></Box>
      <Typography
        level="h1"
        textColor="inherit"
        sx={{ fontWeight: "md", mb: 1 }}
      >
        {isCurrency ? "R" : ""}
        {(value || "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        {isPercent ? "%" : ""}
      </Typography>
    </Box>
  );
}
