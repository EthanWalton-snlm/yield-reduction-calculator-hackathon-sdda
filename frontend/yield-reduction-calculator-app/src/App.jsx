import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [selectedRA, setSelectedRA] = useState('');

  return (
    <>
     <div class="header">
      <img src="./image.png" alt=""></img>
      </div>
    <div class="container">
    <div class="box">
      <h1 class="first-heading">Calculate your Yield Reduction</h1>
      <h1 class="second-heading">Yield Reduction Calculator</h1>
      <div class="underline"></div>
      <p class="description">Calculate the Yield Reduction by entering the relevant information on the left</p>
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

    <tr><td>Internal Tax on Interest R</td><td>-</td></tr>
    <tr><td>Internal Tax on REIT Dividends R</td><td>-</td></tr>
    <tr><td>Internal Tax on Local Dividends R</td><td>-</td></tr>
    <tr><td>Internal Tax on Foreign Dividends R</td><td>-</td></tr>
    <tr><td>Internal Tax on Capital Gains R</td><td>-</td></tr>
    <tr><td>Total Internal Tax R</td><td>-</td></tr>
    <tr><td>Wrapper Cost R</td><td>-</td></tr>
    <tr><td>Total Cost & Internal Tax R</td><td>-</td></tr>
    <tr><td>Upfront Tax Saving R</td><td>-</td></tr>


    <tr><td>Total Internal Tax R</td><td>-</td></tr>
    <tr><td>Wrapper Cost R</td><td>-</td></tr>
    <tr><td>Actual RA Contribution R</td><td>-</td></tr>
    <tr><td>Max Deductible RA Contribution R</td><td>-</td></tr>
    <tr><td>Upfront Tax Saving from RA Contribution R</td><td>-</td></tr>
    <tr><td>Total Cost & Internal Tax R</td><td>-</td></tr>



    <tr><td>Total Internal Tax R</td><td>-</td></tr>
    <tr><td>Wrapper Cost R</td><td>-</td></tr>
    <tr><td>Total Cost & Internal Tax R</td><td>-</td></tr>
    <tr><td>Upfront Tax Saving R</td><td>-</td></tr>

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
      <td>Annual Yield Reduction/Enhancement - % of Investment Value</td>
      <td>0.18%</td>
    </tr>
    </tbody>
      </table>
      </div>
       <div class="output-box">
       <div>
  <div class="client-details">
    <span class="age">How old will you be on 28 February 2025?</span>
    <div class="age-group">
      <div>
        <label class="age-blocks">65</label>
      </div>
      <div>
        <label class="age-blocks">65-74</label>
      </div>
      <div>
        <label class="age-blocks">74</label>
      </div>
    </div>
     <span class="age">What is your total annual taxable income?</span>
    <div class="textfield-wrapper">
    <div class="textfield-container">
      <label class="textfield">Enter your total annual taxable income</label>
      </div>
      <div class="info-text-container">
        <span>Your gross income minus deductions, e.g. Retirement Annuity, Medical Aid.</span>
      </div>
    </div>
    </div>
      <div class="client-details">
    <span class="age">Total Investment Value</span>
    <div class="textfield-wrapper">
    <div class="textfield-container space">
      <label class="textfield">R</label>
      </div>
      </div>
        <span class="age">Gross Annual Portfolio Return (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

    <span class="age">Return From SA Interest (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

        <span class="age">Return From SA Local Interest (Non-REIT) (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

     <span class="age">Return From SA REIT Dividends (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

     <span class="age">Return From Foreign Dividends (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

     <span class="age">Return From Capital Growth (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

     <span class="age">Average Portfolio Turnover (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

     <span class="age">Assumed Realised Gain On Turnover (%)</span>
    <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

      </div>

        <div class="client-details">
    <span class="age">Wrapper Type</span>
    <select class="options space" id="wrapperType" value={selectedRA} onChange={(e) => setSelectedRA(e.target.value)}>
      <option selected>Endowment</option>
      <option value="RA">RA</option>
      <option>TFSA</option>
      <option>Offshore Endowment</option>
      <option>Local or Foreign Note</option>
    </select>
    <span class="age">Wrapper Annual Cost (EAC %) </span>
      <div class="textfield-wrapper space">
    <div class="textfield-container">
      <input class="textfield" type="number" min="0" step="0.1" value="0"></input>
      </div>
    </div>

{selectedRA == 'RA' && (
     <div>
    <span class="age">Annual RA Contribution</span>
    <div class="textfield-wrapper">
    <div class="textfield-container">
      <label class="textfield">Enter your annual RA contribution</label>
      </div>
      <div class="info-text-container">
        <span>Your gross income minus deductions, e.g. Retirement Annuity, Medical Aid.</span>
      </div>
    </div>
    </div>
)}

</div>
  <button class="calculate"><span><span>Calculate</span></span></button>
    </div>
    </div>
    </div>

    </>
  )
}

export default App
