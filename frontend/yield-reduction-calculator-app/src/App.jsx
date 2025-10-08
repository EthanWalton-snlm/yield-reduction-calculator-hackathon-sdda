import { useState, useRef } from "react";
import { Box, Button, IconButton, Typography } from "@mui/joy";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import "./App.css";
import axios from "axios";
import { ProgressModal } from "./components/ProgressModal/ProgressModal";
import { CalculatorInput } from "./components/CalculatorInput/CalculatorInput";
import { WrapperTypeDropdown } from "./components/WrapperTypeDropdown/WrapperTypeDropdown";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { AgeSpineditInput } from "./components/AgeSpineditInput/AgeSpineditInput";
import { SpineditInput } from "./components/SpineditInput/SpineditInput";
import ResultsPage from "./pages/ResultsPage/ResultsPage";

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
  const { mode, setMode } = useColorScheme();
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
    //setCalculationModalOpen(true);
    setLoading(false);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    console.log("API response:", calculationResultRef.current);
  };

  const fileInputRef = useRef(null);
  const importCsv = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const lines = event.target.result.split("\n");
        const inputValues = lines[1].split(",");
        setClientAge(Number(inputValues[0]));
        setTotalAnnualTaxableIncome(Number(inputValues[1]));
        setTotalInvestmentValue(Number(inputValues[2]));
        setGrossAnnualPortfolioReturn(Number(inputValues[3]));
        setReturnFromSaInterest(Number(inputValues[4]));
        setReturnFromSaLocalDividends(Number(inputValues[5]));
        setReturnFromLocalSaReitDividends(Number(inputValues[6]));
        setReturnFromForeignDividends(Number(inputValues[7]));
        setReturnFromLocalCapitalGrowth(Number(inputValues[8]));
        setAveragePortfolioTurnover(Number(inputValues[9]));
        setAssumedRealisedGainOnTurnover(Number(inputValues[10]));
        setWrapperTypeToAnalyse(inputValues[11]);
        setWrapperAnnualCostEac(Number(inputValues[12]));
        setAnnualRaContribution(Number(inputValues[13]));
      };
      reader.readAsText(file);
    }
  };

  return (
    <CssVarsProvider>
      <Box
        sx={{
          backgroundColor: mode === "dark" ? "#1f1f1f" : "#ffffff",
          transition: "background-color 0.4s ease, color 0.4s ease",
        }}
      >
        <Box className="header">
          <Box>
            <img
              src="https://sanlamprivatewealth.mu/wp-content/uploads/2021/11/Sanlam-Private-wealth-50px-height.png"
              alt=""
              className="logo"
            ></img>
          </Box>
          <Box className="import-csv">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={importCsv}
              style={{ display: "none" }}
            />
            <Button
              onClick={() => fileInputRef.current.click()}
              className="csv-button"
            >
              <FileUploadIcon /> LEGACY XLS
            </Button>
            <ThemeToggle />
          </Box>
        </Box>

        <Box className="container">
          <ProgressModal
            open={loading}
            title={"Generating Overview... This will take about 30 seconds"}
          />
          <Box className="box">
            <Box>
              <h1 className="first-heading">Calculate your Yield Reduction</h1>
              <h1
                className="second-heading"
                style={{ color: mode === "dark" ? "#f0f0f0" : "inherit" }}
              >
                Yield Reduction Calculator
              </h1>
              <Box className="underline"></Box>
              <p
                className="description"
                style={{ color: mode === "dark" ? "#f0f0f0" : "inherit" }}
              >
                Calculate potential yield reduction by entering the relevant
                information below.
              </p>
            </Box>
            {calculated && (
              <ResultsPage
                calculationResultRef={calculationResultRef}
                contentRef={contentRef}
                mode={mode}
                setMode={setMode}
                setLoading={setLoading}
                setCalculated={setCalculated}
              />
            )}
          </Box>
          {!calculated && (
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
                  sx={{ color: "#f0f0f0" }}
                >
                  CALCULATE
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
