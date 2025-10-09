import { useState, useRef, useEffect } from "react";
import { Box, Button, Select, Option, Alert, IconButton } from "@mui/joy";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import "./App.css";
import axios from "axios";
import { ProgressModal } from "./components/ProgressModal/ProgressModal";
import { CalculatorInput } from "./components/CalculatorInput/CalculatorInput";
import { WrapperTypeDropdown } from "./components/WrapperTypeDropdown/WrapperTypeDropdown";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { AgeSpineditInput } from "./components/AgeSpineditInput/AgeSpineditInput";
import { SpineditInput } from "./components/SpineditInput/SpineditInput";
import ResultsPage from "./pages/ResultsPage/ResultsPage";
import * as XLSX from "xlsx";

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
  const [alertMessage, setAlertMessage] = useState(400);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("individuals");
  const [totalAnnualTaxableIncome, setTotalAnnualTaxableIncome] = useState();
  const [totalInvestmentValue, setTotalInvestmentValue] = useState();
  const [grossAnnualPortfolioReturn, setGrossAnnualPortfolioReturn] =
    useState();
  const [returnFromSaInterest, setReturnFromSaInterest] = useState();
  const [returnFromSaLocalDividends, setReturnFromSaLocalDividends] =
    useState();
  const [returnFromLocalSaReitDividends, setReturnFromLocalSaReitDividends] =
    useState();
  const [returnFromForeignDividends, setReturnFromForeignDividends] =
    useState();
  const [returnFromLocalCapitalGrowth, setReturnFromLocalCapitalGrowth] =
    useState();
  const [averagePortfolioTurnover, setAveragePortfolioTurnover] = useState();
  const [assumedRealisedGainOnTurnover, setAssumedRealisedGainOnTurnover] =
    useState();
  const [wrapperTypeToAnalyse, setWrapperTypeToAnalyse] = useState(
    "Local or Foreign Note"
  );
  const [wrapperAnnualCostEac, setWrapperAnnualCostEac] = useState();
  const [annualRaContribution, setAnnualRaContribution] = useState();
  const [clientAge, setClientAge] = useState();
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef();
  const calculationResultRef = useRef(null);

  const handleCalculation = async () => {
    const params = {
      selectedEntity,
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

    try {
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
    } catch (error) {
      setLoading(false);
      setAlertMessage(error.message);
      console.log(error.message);
      setShowAlert(true);
    }
  };

  const fileInputRef = useRef(null);

  const resetInputs = () => {
    setClientAge();
    setTotalAnnualTaxableIncome();
    setTotalInvestmentValue();
    setGrossAnnualPortfolioReturn();
    setReturnFromSaInterest();
    setReturnFromSaLocalDividends();
    setReturnFromLocalSaReitDividends();
    setReturnFromForeignDividends();
    setReturnFromLocalCapitalGrowth();
    setAveragePortfolioTurnover();
    setAssumedRealisedGainOnTurnover();
    setWrapperTypeToAnalyse();
    setWrapperAnnualCostEac();
    setAnnualRaContribution();
  };

  useEffect(() => {
    if (calculated === false) {
      resetInputs();
    }
  }, [calculated]); // dependency: re-run when isOpen changes

  const importExcel = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet contains your data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON array of rows
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const map = {};
        rows.forEach(([key, val]) => {
          if (key && val !== undefined) {
            map[key.trim()] = val;
          }
        });

        const sanitizeValue = (val) => {
          const str = String(val)
            .replace(/[^0-9.-]+/g, "")
            .trim();
          return Number(str);
        };

        // Set values using the map
        if (map["Client's Age"])
          setClientAge(sanitizeValue(map["Client's Age"]));
        if (map["Client's Total Annual Taxable Income (Before RA)"])
          setTotalAnnualTaxableIncome(
            sanitizeValue(
              map["Client's Total Annual Taxable Income (Before RA)"]
            )
          );
        if (map["Total Investment Value (R)"])
          setTotalInvestmentValue(
            sanitizeValue(map["Total Investment Value (R)"])
          );
        if (map["Gross Annual Portfolio Return (%)"])
          setGrossAnnualPortfolioReturn(
            sanitizeValue(map["Gross Annual Portfolio Return (%)"])
          );
        if (map["- % of Return from SA Interest"])
          setReturnFromSaInterest(
            sanitizeValue(map["- % of Return from SA Interest"])
          );
        if (map["- % of Return from SA Local Dividends (Non-REIT)"])
          setReturnFromSaLocalDividends(
            sanitizeValue(
              map["- % of Return from SA Local Dividends (Non-REIT)"]
            )
          );
        if (map["- % of Return from SA REIT Dividends"])
          setReturnFromLocalSaReitDividends(
            sanitizeValue(map["- % of Return from SA REIT Dividends"])
          );
        if (map["- % of Return from Foreign Dividends"])
          setReturnFromForeignDividends(
            sanitizeValue(map["- % of Return from Foreign Dividends"])
          );
        if (map["- % of Return from Capital Growth"])
          setReturnFromLocalCapitalGrowth(
            sanitizeValue(map["- % of Return from Capital Growth"])
          );
        if (map["Average Portfolio Turnover (%)"])
          setAveragePortfolioTurnover(
            sanitizeValue(map["Average Portfolio Turnover (%)"])
          );
        if (map["Assumed Realised Gain on Turnover (%)"])
          setAssumedRealisedGainOnTurnover(
            sanitizeValue(map["Assumed Realised Gain on Turnover (%)"])
          );
        if (map["Wrapper Type to Analyse"])
          setWrapperTypeToAnalyse(map["Wrapper Type to Analyse"]);
        if (map["Wrapper Annual Cost (EAC %)"])
          setWrapperAnnualCostEac(
            sanitizeValue(map["Wrapper Annual Cost (EAC %)"])
          );
        if (map["Annual RA Contribution (if RA is selected)"])
          setAnnualRaContribution(
            sanitizeValue(map["Annual RA Contribution (if RA is selected)"])
          );
      };

      reader.readAsArrayBuffer(file); // Changed from readAsText to readAsArrayBuffer
    }
  };
  return (
    <CssVarsProvider>
      {showAlert && (
        <Box
          sx={{
            position: "fixed",
            bottom: 36,
            right: 36,
            zIndex: 1000,
          }}
        >
          <Alert
            color="danger"
            endDecorator={
              <IconButton
                variant="plain"
                size="sm"
                color="danger"
                onClick={() => setShowAlert(false)}
              >
                <CloseRoundedIcon />
              </IconButton>
            }
          >
            Error: {alertMessage}
          </Alert>
        </Box>
      )}
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
          <ThemeToggle />
        </Box>

        <Box className="container">
          <ProgressModal open={loading} />
          <Box className="box">
            <Box>
              <h1 className="first-heading">Calculate your Yield Reduction</h1>
              <h1
                className="second-heading"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  color: mode === "dark" ? "#f0f0f0" : "inherit",
                  fontWeight: "600",
                }}
              >
                Yield Reduction Calculator for{" "}
                <Select
                  variant="soft"
                  className="first-heading"
                  defaultValue="individuals"
                  color="primary"
                  disabled={calculated ? true : false}
                  onChange={(e, newValue) => setSelectedEntity(newValue)}
                  sx={{
                    minWidth: 140,
                    fontSize: "1em",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    color: mode === "dark" ? "#f0f0f0" : "inherit",
                    borderBottom: "2px solid",
                    borderColor: "primary.outlinedBorder",
                    "&:hover": {
                      backgroundColor: "rgba(0, 117, 201, 0.1)",
                      borderColor: "primary.outlinedHoverBorder",
                    },
                    "&.Mui-focused": {
                      borderColor: "primary.solidBg",
                    },
                    marginLeft: "0.25em",
                  }}
                >
                  <Option value="individuals">Individuals</Option>
                  <Option value="companies">Companies</Option>
                  <Option value="trusts">Trusts</Option>
                </Select>
              </h1>

              <Box className="underline"></Box>
              <p
                className="description"
                style={{ color: mode === "dark" ? "#f0f0f0" : "inherit" }}
              >
                {!calculated
                  ? "Calculate potential yield reduction by entering the relevant information below or import a csv file with the relevant information."
                  : "View a breakdown on your potential yield reduction and interact with our AI agent for more information."}
              </p>
            </Box>
            <Box className="import-csv" sx={{ mt: -2, mb: 2 }}>
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                onChange={importExcel}
                style={{ display: "none" }}
              />
              {!calculated && (
                <Button
                  onClick={() => fileInputRef.current.click()}
                  className="csv-button"
                >
                  <FileUploadIcon /> LEGACY XLSX
                </Button>
              )}
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
                    {selectedEntity === "individuals" && (
                      <AgeSpineditInput
                        title={
                          "How old will the client be on 28 February 2025?"
                        }
                        value={clientAge}
                        setValue={setClientAge}
                      />
                    )}
                    <CalculatorInput
                      title={`What is the ${
                        selectedEntity === "individuals"
                          ? "client"
                          : selectedEntity === "companies"
                          ? "company"
                          : "trust"
                      }'s total annual taxable income?`}
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
