import { Modal, CircularProgress } from "@mui/joy";

export function ProgressModal({ open }) {
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
      <CircularProgress size="lg" />
    </Modal>
  );
}
