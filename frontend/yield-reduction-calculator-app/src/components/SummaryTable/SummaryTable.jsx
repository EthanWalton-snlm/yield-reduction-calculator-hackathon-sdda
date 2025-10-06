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

export function SummaryTable({ contentRef }) {
  return (
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
            <td>Annual Yield Reduction/Enhancement - % of Investment Value</td>
            <td>0.18%</td>
          </tr>
        </tbody>
      </table>
    </Box>
  );
}
