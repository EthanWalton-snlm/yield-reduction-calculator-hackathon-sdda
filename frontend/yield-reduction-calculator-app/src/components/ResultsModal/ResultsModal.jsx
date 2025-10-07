import {
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  CircularProgress,
} from "@mui/joy";

export function ResultsModal({ open, setOpen, calculationResultRef }) {
  return (
    <Modal
      aria-labelledby="modal-title"
      open={open}
      onClose={() => setOpen(false)}
    >
      <ModalDialog>
        <ModalClose />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 1 }}
        >
          Results
        </Typography>
        <Typography
          component="h3"
          level="h5"
          textColor="inherit"
          sx={{ fontWeight: "md", mb: 1 }}
        >
          Monetary: R{calculationResultRef.current?.yieldReductionEnhancement}
        </Typography>
        <Typography
          component="h3"
          level="h5"
          textColor="inherit"
          sx={{ fontWeight: "md", mb: 1 }}
        >
          Percentage:{" "}
          {calculationResultRef.current?.yieldReductionEnhancementPercent * 100}
          %
        </Typography>
      </ModalDialog>
    </Modal>
  );
}
