import { useState, useRef } from "react";
import { Box, Button, IconButton } from "@mui/joy";
import "../../App.css";
import { ResultBox } from "../../components/ResultBox/ResultBox";
import { SummaryTable } from "../../components/SummaryTable/SummaryTable";
import { ChatInterface } from "../../components/Chatbot/ChatInterface";
import { ProgressModal } from "../../components/ProgressModal/ProgressModal";
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import html2pdf from "html2pdf.js";
import RestartAltSharpIcon from "@mui/icons-material/RestartAltSharp";
import SmartToyIcon from "@mui/icons-material/SmartToy";

function ResultsPage({
  calculationResultRef,
  contentRef,
  mode,
  setMode,
  setCalculated,
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const element = contentRef.current;

    const isDark = mode === "dark";
    if (isDark) setMode("light");

    const options = {
      margin: 1,
      filename: "yield_calculation.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a2", orientation: "portrait" },
    };

    setLoading(true);
    const worker = html2pdf().set(options).from(element);

    const pdfBlob = await worker.outputPdf("blob");

    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");

    if (isDark) setMode("dark");
    setLoading(false);
  };

  const scrollRef = useRef(null);

  const scrollToAi = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 36,
          right: 36,
          zIndex: 1000,
        }}
      >
        <IconButton
          variant="solid"
          color="primary"
          size="lg"
          onClick={scrollToAi}
        >
          <SmartToyIcon />
        </IconButton>
      </Box>
      <ProgressModal
        open={loading}
        title={"Compiling PDF... This will take about 30 seconds"}
      />
      <Box className="flex-row">
        <ResultBox
          title={"Monetary Reduction"}
          value={calculationResultRef.current.yieldReductionEnhancement.toFixed(
            2
          )}
          isCurrency
        />
        <ResultBox
          title={"Percentage Reduction"}
          value={(
            calculationResultRef.current?.yieldReductionEnhancementPercent * 100
          )?.toFixed(3)}
          isPercent
        />
      </Box>
      <Box className="flex-row">
        {/* TODO: Are you sure modal */}
        <IconButton
          onClick={() => setCalculated(false)}
          sx={{ my: 3, color: "#f0f0f0" }}
        >
          <RestartAltSharpIcon />
        </IconButton>
        <Button
          onClick={handleDownload}
          endDecorator={<PictureAsPdfSharpIcon />}
          sx={{
            my: 3,
            color: "#f0f0f0",
            display: "flex",
          }}
          className="sanlam-button-reverse"
        >
          DOWNLOAD DETAILS{" "}
        </Button>
      </Box>

      <Box className="flex-column">
        <SummaryTable
          contentRef={contentRef}
          data={calculationResultRef.current}
          mode={mode}
        />
        <Box ref={scrollRef}>
          <ChatInterface
            calculationData={calculationResultRef.current}
            aiResponse={calculationResultRef.current?.aiResponse}
          />
        </Box>
      </Box>
    </>
  );
}

export default ResultsPage;
