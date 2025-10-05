import { useState, useRef } from "react";
import {Input, Option, Select, Box, Typography, Textarea, Button} from "@mui/joy";
import html2pdf from 'html2pdf.js';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import "./App.css";

function ThemeToggle() {
    const { mode, setMode } = useColorScheme();

  return (
    <Button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
      Toggle {mode === 'dark' ? 'Light' : 'Dark'} Mode
    </Button>
  );
}

function App() {
  const [selectedRA, setSelectedRA] = useState("");
  const contentRef = useRef();

  const handleDownload = () => {
    const element = contentRef.current;
    if (!element) return;

    const options = {
      margin: 1,
      filename: 'test.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <CssVarsProvider>
      <Box class="header">
        <img src="https://sanlamprivatewealth.mu/wp-content/uploads/2021/11/Sanlam-Private-wealth-50px-height.png" alt="" className="logo"></img>
    <ThemeToggle/>
      </Box>

      <Box class="container">
        <Box class="box">
          <Box>
          <h1 class="first-heading">Calculate your Yield Reduction</h1>
          <h1 class="second-heading">Yield Reduction Calculator</h1>
          <Box class="underline"></Box>
          <p class="description">
            Calculate the Yield Reduction by entering the relevant information
            on the left
          </p>
          </Box>
          <Box ref={contentRef} id="content">
          <table cellpadding="10" cellspacing="0">
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
          <Button onClick={handleDownload}>Download PDF</Button>
        </Box>
        <Box className="output-box">
          <Box>
            <Box className="client-details">
              <Typography className="age">
                How old will you be on 28 February 2025?
              </Typography>
              <Box className="age-group">
                <Box>
                  <Button color="neutral"
                  onClick={function(){}}
                  variant="soft" className="age-blocks">{'<'} 65</Button>
                </Box>
                <Box>
                   <Button color="neutral"
                  onClick={function(){}}
                  variant="soft" className="age-blocks">65-74</Button>
                </Box>
                <Box>
                  <Button color="neutral"
                  onClick={function(){}}
                  variant="soft" className="age-blocks">{'>'} 74</Button>
                </Box>
              </Box>
               <Typography className="age">What is your total annual taxable income? </Typography>
              <Box className="textfield-wrapper">
                {/* <div class="textfield-container"> */}
                  <Textarea
                  color="neutral"
                  disabled={false}
                  minRows={2}
                  placeholder="Enter your total annual taxable income"
                  size="md"
                  className="textfield"
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
                  <Textarea color="neutral"
                  disabled={false}
                  minRows={2}
                  placeholder="R"
                  size="md"
                  className="textfield">
                      </Textarea>
                </Box>
              </Box>
              <Typography className="age">Gross Annual Portfolio Return (%)</Typography>
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
                />
                </Box>
              </Box>

              <Typography className="age">Return From SA Interest (%)</Typography>
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
                />
                </Box>
              </Box>

              <Typography className="age">
                Return From SA Local Interest (Non-REIT) (%)
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
                />
                </Box>
              </Box>

              <Typography className="age">Return From SA REIT Dividends (%)</Typography>
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
                />
                </Box>
              </Box>

              <Typography className="age">Return From Foreign Dividends (%)</Typography>
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
                />
                </Box>
              </Box>

              <Typography className="age">Return From Capital Growth (%)</Typography>
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
                />
                </Box>
              </Box>

              <Typography className="age">Average Portfolio Turnover (%)</Typography>
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
                />
                </Box>
              </Box>

              <Typography className="age">Assumed Realised Gain On Turnover (%)</Typography>
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
              value={selectedRA}
              onChange={(e, newValue) => setSelectedRA(newValue)}
              placeholder="Endowment"
            >
            <Option value="Endowment">Endowment</Option>
            <Option value="RA">RA</Option>
            <Option value="TFSA">TFSA</Option>
            <Option value="Offshore Endowment">Offshore Endowment</Option>
            <Option value="Local or Foreign Note">Local or Foreign Note</Option>
            </Select>
              <Typography className="age">Wrapper Annual Cost (EAC %) </Typography>
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
                />
                </Box>
              </Box>

              {selectedRA == "RA" && (
                <Box>
                  <Typography className="age">Annual RA Contribution</Typography>
                  <Box className="textfield-wrapper">
                    <Box className="textfield-container">
                      <Textarea color="neutral"
                  disabled={false}
                  minRows={2}
                  placeholder="Enter your annual RA contribution"
                  size="md"
                  className="textfield">
                      </Textarea>
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
            <Button onClick={function () {}} variant="solid" className="calculate">
              Calculate
            </Button>
          </Box>
        </Box>
      </Box>
      </CssVarsProvider>
  );
}

export default App;
