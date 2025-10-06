import { useState, useRef } from "react";
import {
  Input,
  Option,
  Select,
  Box,
  Typography,
  Textarea,
  Button,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Table,
  Sheet,
} from "@mui/joy";
import html2pdf from "html2pdf.js";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import "./App.css";
import axios from "axios";

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
      <Modal
        aria-labelledby="modal-title"
        open={calculationModalOpen}
        onClose={() => setCalculationModalOpen(false)}
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
            {calculationResultRef.current?.yieldReductionEnhancementPercent *
              100}
            %
          </Typography>
        </ModalDialog>
      </Modal>

      <Box className="header">
        <img
          src="https://sanlamprivatewealth.mu/wp-content/uploads/2021/11/Sanlam-Private-wealth-50px-height.png"
          alt=""
          className="logo"
        ></img>
        <ThemeToggle />
      </Box>

      <Box className="container">
        <Box className="box" ref={contentRef}>
          {/* Inline YieldCalculator */}
          <div className="yield-calculator-container">
            <div className="yield-calculator-card">
              {/* Header Section */}
              <div className="yield-header-section">
                <Typography level="h2" sx={{ mb: 2, textAlign: 'center' }}>
                  Yield Reduction Calculator
                </Typography>
                <div className="yield-underline"></div>
                <Typography level="body-md" sx={{ textAlign: 'center', mb: 3 }}>
                  Calculate the Yield Reduction by entering the relevant information
                  on the right.
                </Typography>
              </div>

              {/* Table Section */}
              <div className="yield-content-section">
                <div className="yield-table-container">
                  <Sheet variant="outlined" sx={{ borderRadius: 'sm', overflow: 'auto' }}>
                    <Table
                      variant="soft"
                      stripe="even"
                      hoverRow
                      sx={{
                        '& th': {
                          borderRight: '1px solid',
                          borderRightColor: 'divider',
                          '&:last-child': {
                            borderRight: 'none'
                          }
                        },
                        '& td': {
                          borderRight: '1px solid',
                          borderRightColor: 'divider',
                          '&:last-child': {
                            borderRight: 'none'
                          }
                        }
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: '60%' }}>
                            <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>
                              Description
                            </Typography>
                          </th>
                          <th style={{ width: '40%' }}>
                            <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>
                              Amount (R)
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <Typography
                                level="body-sm"
                                sx={{
                                  fontWeight: row.highlight ? 'bold' : 'normal',
                                  color: row.highlight ? 'primary.500' : 'inherit'
                                }}
                              >
                                {row.label}
                              </Typography>
                            </td>
                            <td>
                              <Typography
                                level="body-sm"
                                sx={{
                                  fontWeight: row.highlight ? 'bold' : 'normal',
                                  color: row.highlight ? 'primary.500' : 'inherit'
                                }}
                              >
                                {row.value}
                              </Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleDownload}>Download PDF</button>
        </Box>
        <Box className="output-box">
          <Box>
            <Box className="client-details">
              <Typography className="age">
                How old will you be on 28 February 2025?
              </Typography>
              <Box className="age-group">
                <Box>
                  <Button
                    color="neutral"
                    onClick={function () {}}
                    variant="soft"
                    className="age-blocks"
                  >
                    {"<"} 65
                  </Button>
                </Box>
                <Box>
                  <Button
                    color="neutral"
                    onClick={function () {}}
                    variant="soft"
                    className="age-blocks"
                  >
                    65-74
                  </Button>
                </Box>
                <Box>
                  <Button
                    color="neutral"
                    onClick={function () {}}
                    variant="soft"
                    className="age-blocks"
                  >
                    {">"} 74
                  </Button>
                </Box>
              </Box>
              <Typography className="age">
                What is your total annual taxable income?{" "}
              </Typography>
              <Box className="textfield-wrapper">
                {/* <div class="textfield-container"> */}
                <Textarea
                  color="neutral"
                  disabled={false}
                  minRows={2}
                  placeholder="Enter your total annual taxable income"
                  size="md"
                  className="textfield"
                  value={totalAnnualTaxableIncome}
                  onChange={(e) => setTotalAnnualTaxableIncome(e.target.value)}
                />
                {/* </div> */}
                <Box className="info-text-container">
                  <Typography>
                    Your gross income minus deductions, e.g. Retirement Annuity,
                    Medical Aid.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="client-details">
              <Typography className="age">Total Investment Value</Typography>
              <Box className="textfield-wrapper">
                <Box className="textfield-container space">
                  <Textarea
                    color="neutral"
                    disabled={false}
                    minRows={2}
                    placeholder="R"
                    size="md"
                    className="textfield"
                    value={totalInvestmentValue}
                    onChange={(e) => setTotalInvestmentValue(e.target.value)}
                  ></Textarea>
                </Box>
              </Box>
              <Typography className="age">
                Gross Annual Portfolio Return (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={grossAnnualPortfolioReturn}
                    onChange={(e) =>
                      setGrossAnnualPortfolioReturn(e.target.value)
                    }
                  />
                </Box>
              </Box>

              <Typography className="age">
                Return From SA Interest (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={returnFromSaInterest}
                    onChange={(e) => setReturnFromSaInterest(e.target.value)}
                  />
                </Box>
              </Box>

              <Typography className="age">
                Return From SA Local Dividends (Non-REIT) (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={returnFromSaLocalDividends}
                    onChange={(e) =>
                      setReturnFromSaLocalDividends(e.target.value)
                    }
                  />
                </Box>
              </Box>

              <Typography className="age">
                Return From Local SA REIT Dividends (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={returnFromLocalSaReitDividends}
                    onChange={(e) =>
                      setReturnFromLocalSaReitDividends(e.target.value)
                    }
                  />
                </Box>
              </Box>

              <Typography className="age">
                Return From Foreign Dividends (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={returnFromForeignDividends}
                    onChange={(e) =>
                      setReturnFromForeignDividends(e.target.value)
                    }
                  />
                </Box>
              </Box>

              <Typography className="age">
                Return From Capital Growth (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={returnFromLocalCapitalGrowth}
                    onChange={(e) =>
                      setReturnFromLocalCapitalGrowth(e.target.value)
                    }
                  />
                </Box>
              </Box>

              <Typography className="age">
                Average Portfolio Turnover (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={averagePortfolioTurnover}
                    onChange={(e) =>
                      setAveragePortfolioTurnover(e.target.value)
                    }
                  />
                </Box>
              </Box>

              <Typography className="age">
                Assumed Realised Gain On Turnover (%)
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={assumedRealisedGainOnTurnover}
                    onChange={(e) =>
                      setAssumedRealisedGainOnTurnover(e.target.value)
                    }
                  />
                </Box>
              </Box>
            </Box>

            <Box className="client-details">
              <Typography className="age">Wrapper Type</Typography>
              <Select
                variant="soft"
                className="options space"
                id="wrapperType"
                value={wrapperTypeToAnalyse}
                onChange={(e, newValue) => setWrapperTypeToAnalyse(newValue)}
                placeholder="Endowment"
              >
                <Option value="Endowment">Endowment</Option>
                <Option value="RA">RA</Option>
                <Option value="TFSA">TFSA</Option>
                <Option value="Offshore Endowment">Offshore Endowment</Option>
                <Option value="Local or Foreign Note">
                  Local or Foreign Note
                </Option>
              </Select>
              <Typography className="age">
                Wrapper Annual Cost (EAC %){" "}
              </Typography>
              <Box className="textfield-wrapper space">
                <Box className="textfield-container">
                  <Input
                    className="textfield"
                    type="number"
                    variant="soft"
                    defaultValue={0}
                    slotProps={{
                      input: {
                        min: 0,
                        max: 100,
                        step: 0.1,
                      },
                    }}
                    value={wrapperAnnualCostEac}
                    onChange={(e) => setWrapperAnnualCostEac(e.target.value)}
                  />
                </Box>
              </Box>

              {wrapperTypeToAnalyse == "RA" && (
                <Box>
                  <Typography className="age">
                    Annual RA Contribution
                  </Typography>
                  <Box className="textfield-wrapper">
                    <Box className="textfield-container">
                      <Textarea
                        color="neutral"
                        disabled={false}
                        minRows={2}
                        placeholder="Enter your annual RA contribution"
                        size="md"
                        className="textfield"
                        value={annualRaContribution}
                        onChange={(e) =>
                          setAnnualRaContribution(e.target.value)
                        }
                      ></Textarea>
                    </Box>
                    <Box className="info-text-container">
                      <Typography>
                        Your gross income minus deductions, e.g. Retirement
                        Annuity, Medical Aid.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {/* <button class="calculate"><span><span>Calculate</span></span></button> */}
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
