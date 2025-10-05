// YieldCalculator.jsx
import React from 'react';
import './App.css';


const YieldCalculator = () => {
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

  return (
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
        <div className="yield-content-section">
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
  );
};

export default YieldCalculator;
