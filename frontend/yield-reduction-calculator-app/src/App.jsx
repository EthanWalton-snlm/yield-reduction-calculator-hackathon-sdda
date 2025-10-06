import { useState, useRef } from "react";
import {Input, Option, Select, Box, Typography, Textarea, Button, IconButton} from "@mui/joy";
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

  const handleDownload = () => {
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

    console.log('Starting PDF generation...');
    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => console.log('PDF saved successfully'))
      .catch(err => {
        console.error('PDF generation failed:', err);
        alert('PDF generation failed. Check console for details.');
      });
  };

  return (
    <CssVarsProvider>
      <Box className="header">
        <img src="https://sanlamprivatewealth.mu/wp-content/uploads/2021/11/Sanlam-Private-wealth-50px-height.png" alt="" className="logo"></img>
    <ThemeToggle/>
      </Box>

      <Box className="container">
        <Box className="box" >
          {/* Inline YieldCalculator */}
          <div className="yield-calculator-container">
            <div className="yield-calculator-card">
              {/* Header Section */}
              <div className="yield-header-section">
                <h1 className="yield-second-heading">Yield Reduction Calculator</h1>
                <div className="yield-underline"></div>
                <p className="yield-description">
                  Calculate the Yield Reduction by entering the relevant information
                  on the right.
                </p>
              </div>

              {/* Table Section */}
              <div className="yield-content-section" ref={contentRef}>
                <div className="yield-table-container">
                  <table className="yield-data-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount (R)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr
                          key={index}
                          className={
                            row.highlight
                              ? 'yield-highlight-row'
                              : index % 2 === 0
                                ? 'yield-even-row'
                                : 'yield-odd-row'
                          }
                        >
                          <td className="yield-label-cell">{row.label}</td>
                          <td className="yield-value-cell">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

      <Box className="chatbot-icon">
        <IconButton variant="solid" color="primary" sx={{ fontSize: '24px' }}>
          💬
        </IconButton>
      </Box>

    </CssVarsProvider>
  );
}

export default App;
