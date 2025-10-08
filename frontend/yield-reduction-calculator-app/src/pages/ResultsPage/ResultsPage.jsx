import { useState } from "react";
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

function ResultsPage({
  calculationResultRef,
  contentRef,
  mode,
  setMode,
  setCalculated,
}) {
  const [showSummaryTable, setShowSummaryTable] = useState(false);
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
    await html2pdf().set(options).from(element).save();

    if (isDark) setMode("dark");
    setLoading(false);
  };

  return (
    <>
      <ProgressModal open={loading} title={"Compiling PDF..."} />
      <Box className="flex-row">
        <ResultBox
          title={"Monetary Reduction"}
          value={calculationResultRef.current?.yieldReductionEnhancement}
          isCurrency
        />
        <ResultBox
          title={"Percentage Reduction"}
          value={
            calculationResultRef.current?.yieldReductionEnhancementPercent * 100
          }
          isPercent
        />
      </Box>
      <Box className="flex-row">
        <IconButton
          onClick={() => setCalculated(false)}
          sx={{ my: 3, color: "#f0f0f0" }}
        >
          <RestartAltSharpIcon />
        </IconButton>
        <Button
          onClick={() => setShowSummaryTable(!showSummaryTable)}
          endDecorator={
            showSummaryTable ? <ExpandLessIcon /> : <ExpandMoreIcon />
          }
          sx={{ my: 3, color: "#f0f0f0" }}
          className="sanlam-button"
        >
          VIEW SUMMARY
        </Button>
        <Button
          onClick={handleDownload}
          endDecorator={<PictureAsPdfSharpIcon />}
          sx={{
            my: 3,
            color: "#f0f0f0",
            display: showSummaryTable ? "flex" : "none",
          }}
          className="sanlam-button-reverse"
        >
          DOWNLOAD SUMMARY{" "}
        </Button>
      </Box>
      {showSummaryTable && (
        <>
          <SummaryTable
            contentRef={contentRef}
            data={calculationResultRef.current}
            mode={mode}
          />
          <ChatInterface
            calculationData={calculationResultRef.current}
            aiResponse={calculationResultRef.current?.aiResponse}
          />
        </>
      )}
    </>
  );
}

export default ResultsPage;
