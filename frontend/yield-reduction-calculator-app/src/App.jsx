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
} from "@mui/joy";
import html2pdf from "html2pdf.js";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import "./App.css";
import axios from "axios";
import DarkModeSharpIcon from '@mui/icons-material/DarkModeSharp';
import LightModeSharpIcon from '@mui/icons-material/LightModeSharp';
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp';


function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <Button onClick={() => setMode(mode === "dark" ? "light" : "dark")} variant="plain">
      {mode === "dark" ? <LightModeSharpIcon/> : <DarkModeSharpIcon/>}
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
  const { mode, setMode } = useColorScheme();
  const calculationResultRef = useRef(null);

  const handleDownload = async () => {
    const element = contentRef.current;

    const isDark = mode === "dark";
    if (isDark) setMode("light");

    const options = {
      margin: 1,
      filename: "test.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    await html2pdf().set(options).from(element).save();

    if (isDark) setMode("dark");
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

      <Box class="container">
        <Box class="box">
          <Box>
            <h1 class="first-heading">Calculate your Yield Reduction</h1>
            <h1 class="second-heading">Yield Reduction Calculator</h1>
            <Box class="underline"></Box>
            <p class="description">
              Calculate the Yield Reduction by entering the relevant information
              on the right
            </p>
          </Box>
          <Box ref={contentRef} id="content">
            <table cellPadding="10" cellSpacing="0">
              <tbody>
                <tr>
                  <td>Gross Portfolio Return</td>
                  <td>2000000</td>
                </tr>
                <tr>
                  <td>SA Interest R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>SA Local Dividends R</td>
                  <td>100000</td>
                </tr>
                <tr>
                  <td>SA REIT Dividends</td>
                  <td>40000</td>
                </tr>
                <tr>
                  <td>Foreign Dividends</td>
                  <td>100000</td>
                </tr>
                <tr>
                  <td>Gross Realised Capital Gains R</td>
                  <td>600000</td>
                </tr>
                <tr>
                  <td>Adjusted Taxable Income for RA</td>
                  <td>5000000</td>
                </tr>
                <tr>
                  <td>Gross Income Tax Payabable</td>
                  <td>2076839</td>
                </tr>
                <tr>
                  <td>Applicable Rebate</td>
                  <td>17235</td>
                </tr>
                <tr>
                  <td>Clients Marginal Income Tax Rate</td>
                  <td>45%</td>
                </tr>
                <tr>
                  <td>Interest Exemption R</td>
                  <td>23800</td>
                </tr>
                <tr>
                  <td>Taxable Interest R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Tax on Interest R</td>
                  <td>-</td>
                </tr>

                <tr>
                  <td>Tax on SA Local Dividends (DWT) R</td>
                  <td>20000</td>
                </tr>
                <tr>
                  <td>Tax on SA REIT Dividends R</td>
                  <td>18000</td>
                </tr>
                <tr>
                  <td>Tax on Foreign Dividends R</td>
                  <td>20000</td>
                </tr>
                <tr>
                  <td>Net Realised Capital Gains after Annual Exclusion R</td>
                  <td>560000</td>
                </tr>
                <tr>
                  <td>Taxable Portion of Capital Gains R</td>
                  <td>224000</td>
                </tr>
                <tr>
                  <td>Tax on Capital Gains R</td>
                  <td>100800</td>
                </tr>
                <tr>
                  <td>Total Tax Unwrapped R</td>
                  <td>158800</td>
                </tr>
                <tr>
                  <td>Internal Tax on Interest R - Note</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Internal Tax on REIT Dividends R - Note</td>
                  <td>12000</td>
                </tr>
                <tr>
                  <td>Internal Tax on Local Dividends R - Note</td>
                  <td>20000</td>
                </tr>
                <tr>
                  <td>Internal Tax on Foreign Dividends R - Note</td>
                  <td>20000</td>
                </tr>
                <tr>
                  <td>Internal Tax on Capital Gains R - Note</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Total Tax on Local or Foreign Note</td>
                  <td>52000</td>
                </tr>
                <tr>
                  <td>Cost of Note</td>
                  <td>70000</td>
                </tr>
                <tr>
                  <td>Total Cost of Note and Internal Tax</td>
                  <td>122000</td>
                </tr>

                <tr>
                  <td>Internal Tax on Interest R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Internal Tax on REIT Dividends R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Internal Tax on Local Dividends R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Internal Tax on Foreign Dividends R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Internal Tax on Capital Gains R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Total Internal Tax R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Wrapper Cost R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Total Cost & Internal Tax R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Upfront Tax Saving R</td>
                  <td>-</td>
                </tr>

                <tr>
                  <td>Total Internal Tax R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Wrapper Cost R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Actual RA Contribution R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Max Deductible RA Contribution R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Upfront Tax Saving from RA Contribution R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Total Cost & Internal Tax R</td>
                  <td>-</td>
                </tr>

                <tr>
                  <td>Total Internal Tax R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Wrapper Cost R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Total Cost & Internal Tax R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Upfront Tax Saving R</td>
                  <td>-</td>
                </tr>

                <tr>
                  <td>Total Tax Within Selected Wrapper R</td>
                  <td>52000</td>
                </tr>
                <tr>
                  <td>Monetary Cost of Selected Wrapper R</td>
                  <td>70000</td>
                </tr>
                <tr>
                  <td>Upfront Tax Saving from Selected Wrapper R</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Gross Annual Portfolio Return R</td>
                  <td>2000000</td>
                </tr>
                <tr>
                  <td>Net Return Unwrapped R</td>
                  <td>1841200</td>
                </tr>
                <tr>
                  <td>Net Return Unwrapped %</td>
                  <td>9.21%</td>
                </tr>
                <tr>
                  <td>Net Return Wrapped R</td>
                  <td>1878000</td>
                </tr>
                <tr>
                  <td>Net Return Wrapped %</td>
                  <td>9.39%</td>
                </tr>
                <tr>
                  <td>Annual Yield Reduction/Enhancement - Monetary R</td>
                  <td>36800</td>
                </tr>
                <tr>
                  <td>
                    Annual Yield Reduction/Enhancement - % of Investment Value
                  </td>
                  <td>0.18%</td>
                </tr>
              </tbody>
            </table>
          </Box>
          <Button onClick={handleDownload} endDecorator={<PictureAsPdfSharpIcon />}>Download </Button>
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
        <IconButton variant="solid" color="primary" sx={{ fontSize: "24px" }}>
          💬
        </IconButton>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
