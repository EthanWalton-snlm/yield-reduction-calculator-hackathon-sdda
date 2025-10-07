import { Box, Typography } from "@mui/joy";

export function ResultBox({
  title,
  value,
  isPercent = false,
  isCurrency = false,
}) {
  return (
    <Box className="results-box">
      <Typography
        level="h3"
        textColor="inherit"
        sx={{ fontWeight: "md", mb: 1 }}
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
