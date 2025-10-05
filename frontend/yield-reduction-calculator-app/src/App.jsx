import { useState } from "react";
import {Input, Option, Select, Box, Typography, Textarea, Button} from "@mui/joy";

import "./App.css";
import YieldCalculator from './YieldCalculator';

function App() {
  const [selectedRA, setSelectedRA] = useState("");

  return (
    <>
      <div class="header">
        <img src="./image.png" alt=""></img>
      </div>
      <div class="container">
        <YieldCalculator />
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
      </div>
    </>
  );
}

export default App;
