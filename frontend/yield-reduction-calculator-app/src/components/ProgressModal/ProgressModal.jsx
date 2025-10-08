import { Modal, CircularProgress, Typography, Box } from "@mui/joy";

export function ProgressModal({ open, title = "" }) {
  return (
    <Modal
      open={open}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <Box className="loading">
        <CircularProgress size="lg" />
        {title ? (
          <Typography sx={{ color: "white" }}>{title}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </Modal>
  );
}
