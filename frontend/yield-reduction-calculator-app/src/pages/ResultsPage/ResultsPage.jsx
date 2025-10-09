import { useState, useRef } from "react";
import { Box, Button, IconButton, Modal, ModalClose, Sheet } from "@mui/joy";
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
  const [openChatbot, setOpenChatbot] = useState(false);
  const [downloadTimeStamp, setDownloadTimeStamp] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);


  const handleDownload = async () => {
    const element = contentRef.current;

    const isDark = mode === "dark";
    if (isDark) setMode("light");

     setIsGeneratingPdf(true);

    const formattedTime = new Date().toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

    setDownloadTimeStamp(formattedTime);

    await new Promise(resolve => setTimeout(resolve, 100));

    const options = {
      margin: 1,
      filename: `yield_calculation_${new Date().toISOString().split('T')[0]}.pdf`,
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
     setIsGeneratingPdf(false);
  };

  const scrollRef = useRef(null);

  return (
    <>
      <ProgressModal
        open={loading}
        title={"Compiling PDF... This will take about 30 seconds"}
      />
      <Box className="flex-row">
        <ResultBox
          title={"Annual Tax Savings"}
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
      <Box className="flex-row-space-between">
        {/* TODO: Are you sure modal */}
        <IconButton
          onClick={() => setCalculated(false)}
          sx={{ my: 3, color: "#f0f0f0" }}
        >
          <RestartAltSharpIcon />
        </IconButton>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <Button
            onClick={() => setOpenChatbot(true)}
            endDecorator={<SmartToyIcon />}
            sx={{
              my: 3,
              color: "#f0f0f0",
              display: "flex",
            }}
            className="sanlam-button"
          >
            CHAT WITH SANYIELD{" "}
          </Button>
          <Button
            onClick={handleDownload}
            endDecorator={<PictureAsPdfSharpIcon />}
            sx={{
              my: 3,
              color: "#f0f0f0",
              display: "flex",
            }}
            className={
              mode === "dark" ? "sanlam-button" : "sanlam-button-reverse"
            }
          >
            DOWNLOAD DETAILS{" "}
          </Button>
          </Box>
        </Box>

      <Box className="flex-column">
        <SummaryTable
          contentRef={contentRef}
          data={calculationResultRef.current}
          mode={mode}
          downloadTimeStamp={downloadTimeStamp}
          isGeneratingPdf={isGeneratingPdf}
        />
        <Box ref={scrollRef}>
          <Modal
            open={openChatbot}
            onClose={() => setOpenChatbot(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              className="flex-column"
              sx={{ backgroundColor: "rgba(0,0,0,0)" }}
            >
              <ModalClose
                variant="plain"
                sx={{ p: 1, right: 130, zIndex: 1000 }}
              />
              <ChatInterface
                calculationData={calculationResultRef.current}
                aiResponse={calculationResultRef.current?.aiResponse}
              />
            </Sheet>
          </Modal>
        </Box>
      </Box>
    </>
  );
}

export default ResultsPage;
