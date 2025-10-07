import { useState, useRef } from "react";
import { Box, Button, IconButton, Typography } from "@mui/joy";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import "./App.css";
import axios from "axios";
import { ResultsModal } from "./components/ResultsModal/ResultsModal";
import { ProgressModal } from "./components/ProgressModal/ProgressModal";
import { CalculatorInput } from "./components/CalculatorInput/CalculatorInput";
import { WrapperTypeDropdown } from "./components/WrapperTypeDropdown/WrapperTypeDropdown";
import { SummaryTable } from "./components/SummaryTable/SummaryTable";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
// import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AgeSpineditInput } from "./components/AgeSpineditInput/AgeSpineditInput";
import { SpineditInput } from "./components/SpineditInput/SpineditInput";

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <Button
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      variant="plain"
    >
      {mode === "dark" ? <LightModeSharpIcon /> : <DarkModeSharpIcon />}
    </Button>
  );
}

function App() {
  const [totalAnnualTaxableIncome, setTotalAnnualTaxableIncome] =
    useState(5000000);
  const [totalInvestmentValue, setTotalInvestmentValue] = useState(20000000);
  const [grossAnnualPortfolioReturn, setGrossAnnualPortfolioReturn] =
    useState(0.1);
  const [returnFromSaInterest, setReturnFromSaInterest] = useState(0);
  const [returnFromSaLocalDividends, setReturnFromSaLocalDividends] =
    useState(0.05);
  const [returnFromLocalSaReitDividends, setReturnFromLocalSaReitDividends] =
    useState(0.02);
  const [returnFromForeignDividends, setReturnFromForeignDividends] =
    useState(0.05);
  const [returnFromLocalCapitalGrowth, setReturnFromLocalCapitalGrowth] =
    useState(0.78);
  const [averagePortfolioTurnover, setAveragePortfolioTurnover] = useState(0.3);
  const [assumedRealisedGainOnTurnover, setAssumedRealisedGainOnTurnover] =
    useState(0.1);
  const [wrapperTypeToAnalyse, setWrapperTypeToAnalyse] = useState(
    "Local or Foreign Note"
  );
  const [wrapperAnnualCostEac, setWrapperAnnualCostEac] = useState(0.0035);
  const [annualRaContribution, setAnnualRaContribution] = useState(350000);
  const [clientAge, setClientAge] = useState(55);
  const [calculationModalOpen, setCalculationModalOpen] = useState(false);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef();
  const calculationResultRef = useRef(null);

  const handleCalculation = async () => {
    const params = {
      clientAge,
      totalAnnualTaxableIncome,
      totalInvestmentValue,
      grossAnnualPortfolioReturn,
      returnFromSaInterest,
      returnFromSaLocalDividends,
      returnFromLocalSaReitDividends,
      returnFromForeignDividends,
      returnFromLocalCapitalGrowth,
      averagePortfolioTurnover,
      assumedRealisedGainOnTurnover,
      wrapperTypeToAnalyse,
      wrapperAnnualCostEac,
      annualRaContribution,
    };

    setLoading(true);

    const response = await axios.get("http://localhost:5000/calculate", {
      params,
    });

    calculationResultRef.current = response.data;
    setCalculated(true);
    setCalculationModalOpen(true);
    setLoading(false);
    console.log("API response:", calculationResultRef.current);
  };

  return (
    <CssVarsProvider>
      <Box className="header">
        <img
          src="https://sanlamprivatewealth.mu/wp-content/uploads/2021/11/Sanlam-Private-wealth-50px-height.png"
          alt=""
          className="logo"
        ></img>
        <ThemeToggle />
      </Box>

      <Box className="container">
        <ProgressModal open={loading} />
        <Box className="box">
          <Box>
            <h1 className="first-heading">Calculate your Yield Reduction</h1>
            <h1 className="second-heading">Yield Reduction Calculator</h1>
            <Box className="underline"></Box>
            <p className="description">
              Calculate the Yield Reduction by entering the relevant
              information.
            </p>
          </Box>
          {calculated && (
            <>
              <Typography
                component="h3"
                level="h5"
                textColor="inherit"
                sx={{ fontWeight: "md", mb: 1 }}
              >
                Monetary: R
                {calculationResultRef.current?.yieldReductionEnhancement}
              </Typography>
              <Typography
                component="h3"
                level="h5"
                textColor="inherit"
                sx={{ fontWeight: "md", mb: 1 }}
              >
                Percentage:{" "}
                {calculationResultRef.current
                  ?.yieldReductionEnhancementPercent * 100}
                %
              </Typography>
              <IconButton
                onClick={() => setShowSummaryTable(!showSummaryTable)}
              >
                {" "}
                {showSummaryTable ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </>
          )}
          {showSummaryTable && (
            <SummaryTable
              contentRef={contentRef}
              data={calculationResultRef.current}
            />
          )}
        </Box>
        <Box className="output-box">
          <Box>
            <Box className="flex-row">
              <Box className="client-details">
                <AgeSpineditInput
                  title={"How old will you be on 28 February 2025?"}
                  value={clientAge}
                  setValue={setClientAge}
                />
                <CalculatorInput
                  title={"What is your total annual taxable income?"}
                  value={totalAnnualTaxableIncome}
                  setValue={setTotalAnnualTaxableIncome}
                />
              </Box>

              <Box className="client-details">
                <WrapperTypeDropdown
                  value={wrapperTypeToAnalyse}
                  setValue={setWrapperTypeToAnalyse}
                />
                <SpineditInput
                  title={"Wrapper Annual Cost (EAC %)"}
                  value={wrapperAnnualCostEac}
                  setValue={setWrapperAnnualCostEac}
                />

                {wrapperTypeToAnalyse == "RA" && (
                  <CalculatorInput
                    title={"Annual RA Contribution"}
                    value={annualRaContribution}
                    setValue={setAnnualRaContribution}
                  />
                )}
              </Box>
            </Box>
            <Box className="client-details-fw">
              <CalculatorInput
                title={"Total Investment Value"}
                value={totalInvestmentValue}
                setValue={setTotalInvestmentValue}
              />
              <SpineditInput
                title={"Gross Annual Portfolio Return (%)"}
                value={grossAnnualPortfolioReturn}
                setValue={setGrossAnnualPortfolioReturn}
              />
              <SpineditInput
                title={"Return From SA Interest (%)"}
                value={returnFromSaInterest}
                setValue={setReturnFromSaInterest}
              />
              <SpineditInput
                title={"Return From SA Local Dividends (Non-REIT) (%)"}
                value={returnFromSaLocalDividends}
                setValue={setReturnFromSaLocalDividends}
              />
              <SpineditInput
                title={"Return From Local SA REIT Dividends (%)"}
                value={returnFromLocalSaReitDividends}
                setValue={setReturnFromLocalSaReitDividends}
              />
              <SpineditInput
                title={"Return From Foreign Dividends (%)"}
                value={returnFromForeignDividends}
                setValue={setReturnFromForeignDividends}
              />
              <SpineditInput
                title={"Return From Capital Growth (%)"}
                value={returnFromLocalCapitalGrowth}
                setValue={setReturnFromLocalCapitalGrowth}
              />
              <SpineditInput
                title={"Average Portfolio Turnover (%)"}
                value={averagePortfolioTurnover}
                setValue={setAveragePortfolioTurnover}
              />
              <SpineditInput
                title={"Assumed Realised Gain On Turnover (%)"}
                value={assumedRealisedGainOnTurnover}
                setValue={setAssumedRealisedGainOnTurnover}
              />
            </Box>
            <Button
              onClick={handleCalculation}
              variant="solid"
              className="calculate"
            >
              Calculate
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="chatbot-icon">
        <IconButton variant="solid" color="primary" sx={{ fontSize: "24px" }}>
          💬
        </IconButton>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
