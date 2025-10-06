import { useState, useRef } from "react";
import { Box, Button, IconButton, Typography } from "@mui/joy";
import html2pdf from "html2pdf.js";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import "./App.css";
import axios from "axios";
import { ResultsModal } from "./components/ResultsModal/ResultsModal";
import { CalculatorInput } from "./components/CalculatorInput/CalculatorInput";
import { WrapperTypeDropdown } from "./components/WrapperTypeDropdown/WrapperTypeDropdown";
import { SummaryTable } from "./components/SummaryTable/SummaryTable";

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <Button onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
      Toggle {mode === "dark" ? "Light" : "Dark"} Mode
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

  const contentRef = useRef();

  // YieldCalculator data moved here
  const tableData = [
    { label: 'Gross Portfolio Return', value: '2,000,000' },
    { label: 'SA Interest R', value: '-' },
    { label: 'SA Local Dividends R', value: '100,000' },
    { label: 'SA REIT Dividends', value: '40,000' },
    { label: 'Foreign Dividends', value: '100,000' },
    { label: 'Gross Realised Capital Gains R', value: '600,000' },
    { label: 'Adjusted Taxable Income for RA', value: '5,000,000' },
    { label: 'Gross Income Tax Payable', value: '2,076,839' },
    { label: 'Applicable Rebate', value: '17,235' },
    { label: 'Clients Marginal Income Tax Rate', value: '45%' },
    { label: 'Interest Exemption R', value: '23,800' },
    { label: 'Taxable Interest R', value: '-' },
    { label: 'Tax on Interest R', value: '-' },
    { label: 'Tax on SA Local Dividends (DWT) R', value: '20,000' },
    { label: 'Tax on SA REIT Dividends R', value: '18,000' },
    { label: 'Tax on Foreign Dividends R', value: '20,000' },
    { label: 'Net Realised Capital Gains after Annual Exclusion R', value: '560,000' },
    { label: 'Taxable Portion of Capital Gains R', value: '224,000' },
    { label: 'Tax on Capital Gains R', value: '100,800' },
    { label: 'Total Tax Unwrapped R', value: '158,800' },
    { label: 'Internal Tax on Interest R - Note', value: '0' },
    { label: 'Internal Tax on REIT Dividends R - Note', value: '12,000' },
    { label: 'Internal Tax on Local Dividends R - Note', value: '20,000' },
    { label: 'Internal Tax on Foreign Dividends R - Note', value: '20,000' },
    { label: 'Internal Tax on Capital Gains R - Note', value: '0' },
    { label: 'Total Tax on Local or Foreign Note', value: '52,000' },
    { label: 'Cost of Note', value: '70,000' },
    { label: 'Total Cost of Note and Internal Tax', value: '122,000' },
    { label: 'Total Tax Within Selected Wrapper R', value: '52,000' },
    { label: 'Monetary Cost of Selected Wrapper R', value: '70,000' },
    { label: 'Upfront Tax Saving from Selected Wrapper R', value: '-' },
    { label: 'Gross Annual Portfolio Return R', value: '2,000,000' },
    { label: 'Net Return Unwrapped R', value: '1,841,200' },
    { label: 'Net Return Unwrapped %', value: '9.21%' },
    { label: 'Net Return Wrapped R', value: '1,878,000' },
    { label: 'Net Return Wrapped %', value: '9.39%' },
    { label: 'Annual Yield Reduction/Enhancement - Monetary R', value: '36,800', highlight: true },
    { label: 'Annual Yield Reduction/Enhancement - % of Investment Value', value: '0.18%', highlight: true }
  ];
  const calculationResultRef = useRef(null);

  const handleDownload = async () => {
    console.log('Download button clicked');
    const element = contentRef.current;
    console.log('Element:', element);

    if (!element) {
      console.error('No element found to convert to PDF');
      alert('Error: No content found to download');
      return;
    }

    const options = {
      margin: 0.5,
      filename: 'yield-calculator-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    try {
      console.log('Starting PDF generation...');
      await html2pdf().set(options).from(element).save();
      console.log('PDF saved successfully');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Check console for details.');
    }
  };

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

    const response = await axios.get("http://localhost:5000/calculate", {
      params,
    });
    const [yieldReductionEnhancement, yieldReductionEnhancementPercent] =
      response.data.message.split(",").map((v) => parseFloat(v.trim()));
    calculationResultRef.current = {
      yieldReductionEnhancement,
      yieldReductionEnhancementPercent,
    };
    setCalculationModalOpen(true);
    console.log("Flask response:", calculationResultRef.current);
    console.log(calculationResultRef.current.yieldReductionEnhancement);
    console.log(calculationResultRef.current.yieldReductionEnhancementPercent);
  };

  return (
    <CssVarsProvider>
      <ResultsModal
        open={calculationModalOpen}
        setOpen={setCalculationModalOpen}
        calculationResultRef={calculationResultRef}
      />

      <Box className="header">
        <img
          src="https://sanlamprivatewealth.mu/wp-content/uploads/2021/11/Sanlam-Private-wealth-50px-height.png"
          alt=""
          className="logo"
        ></img>
        <ThemeToggle />
      </Box>

      <Box className="container">
        <Box className="box">
          <Box>
            <h1 className="first-heading">Calculate your Yield Reduction</h1>
            <h1 className="second-heading">Yield Reduction Calculator</h1>
            <Box className="underline"></Box>
            <p className="description">
              Calculate the Yield Reduction by entering the relevant information
              on the right
            </p>
          </Box>
          <Button onClick={() => setShowSummaryTable(!showSummaryTable)}>
            Toggle Summary
          </Button>
          {showSummaryTable && <SummaryTable contentRef={contentRef} />}

          <Button onClick={handleDownload}>Download PDF</Button>
        </Box>
        <Box className="output-box">
          <Box>
            <Box className="client-details">
              <CalculatorInput
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
              <CalculatorInput
                title={"Total Investment Value"}
                value={totalInvestmentValue}
                setValue={setTotalInvestmentValue}
              />
              <CalculatorInput
                title={"Gross Annual Portfolio Return (%)"}
                value={grossAnnualPortfolioReturn}
                setValue={setGrossAnnualPortfolioReturn}
              />
              <CalculatorInput
                title={"Return From SA Interest (%)"}
                value={returnFromSaInterest}
                setValue={setReturnFromSaInterest}
              />
              <CalculatorInput
                title={"Return From SA Local Dividends (Non-REIT) (%)"}
                value={returnFromSaLocalDividends}
                setValue={setReturnFromSaLocalDividends}
              />
              <CalculatorInput
                title={"Return From Local SA REIT Dividends (%)"}
                value={returnFromLocalSaReitDividends}
                setValue={setReturnFromLocalSaReitDividends}
              />
              <CalculatorInput
                title={"Return From Foreign Dividends (%)"}
                value={returnFromForeignDividends}
                setValue={setReturnFromForeignDividends}
              />
              <CalculatorInput
                title={"Return From Capital Growth (%)"}
                value={returnFromLocalCapitalGrowth}
                setValue={setReturnFromLocalCapitalGrowth}
              />
              <CalculatorInput
                title={"Average Portfolio Turnover (%)"}
                value={averagePortfolioTurnover}
                setValue={setAveragePortfolioTurnover}
              />
              <CalculatorInput
                title={"Assumed Realised Gain On Turnover (%)"}
                value={assumedRealisedGainOnTurnover}
                setValue={setAssumedRealisedGainOnTurnover}
              />
            </Box>

            <Box className="client-details">
              <WrapperTypeDropdown
                value={wrapperTypeToAnalyse}
                setValue={setWrapperTypeToAnalyse}
              />
              <CalculatorInput
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
        <IconButton variant="solid" color="primary" sx={{ fontSize: '24px' }}>
          💬
        </IconButton>
      </Box>

    </CssVarsProvider>
  );
}

export default App;
