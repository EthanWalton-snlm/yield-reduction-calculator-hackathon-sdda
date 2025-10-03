def table_lookup(value, table, col_index):
    """
    Finds the last row where threshold <= value
    col_index starts at 1
    Simulates vlookup on excel
    """
    result = -100000000  # None
    for row in table:
        if value >= row[0]:
            result = row[col_index - 1]
        else:
            break
    return result


################################
###### TAX DATA CONSTANTS ######
################################
# tax data
DEDUCTIBLE_PERCENTAGE = 0.275
ANNUAL_CAP_RATE = 350000

PRIMARY_REBATE_AMT = 17235
SECONDARY_REBATE_AMT = 9444
TERIARY_REBATE_AMT = 3145

UNDER_65_EXEMPTION = 23800
OVER_65_EXEMPTION = 34500

DWT_RATE_LOCAL_NON_REIT = 0.2

ANNUAL_EXCLUSION = 40000
INCLUSION_RATE = 0.4

ENDOWMENT_INCOME_RATE = 0.3
ENDOWMENT_CGT_EFFECTIVE_RATE = 0.12

# (lower bound, base tax amount, marginal rate, threshold for rate)
INCOME_TAX_TABLE = [
    (0, 0, 0.18, 0),
    (237101, 42678, 0.26, 237100),
    (370501, 77362, 0.31, 370500),
    (512801, 121475, 0.36, 512800),
    (673001, 179147, 0.39, 673000),
    (857901, 251258, 0.41, 857900),
    (1817001, 644489, 0.45, 1817000),
]

#################################
###### USER CHANGABLE DATA ######
#################################

# client details
total_annual_taxable_income = 5000000
client_age = 55

# investment details
total_investment_value = 20000000
gross_annual_portfolio_return = 0.1
return_from_sa_interest = 0
return_from_sa_local_dividends = 0.05  # (non-REIT)
return_from_local_sa_reit_dividends = 0.02
return_from_foreign_dividends = 0.05
return_from_local_capital_growth = 0.78
average_portfolio_turnover = 0.3
assumed_realised_gain_on_turnover = 0.1

# wrapper details
wrapper_type_to_analyse = "Local or Foreign Note"  # TODO: enum
wrapper_annual_cost_eac = 0.0035
annual_ra_contribution = 350000  # (if RA is selected)

################################
######### CALCULATIONS #########
################################

# calculations
gross_portfolio_return = total_investment_value * gross_annual_portfolio_return
sa_interest = gross_annual_portfolio_return * return_from_sa_interest
sa_local_dividends = gross_portfolio_return * return_from_sa_local_dividends
sa_reit_dividends = gross_portfolio_return * return_from_local_sa_reit_dividends
foreign_dividends = gross_portfolio_return * return_from_foreign_dividends
gross_realised_capital_gains = (
    total_investment_value
    * average_portfolio_turnover
    * assumed_realised_gain_on_turnover
)

adjusted_taxable_income_for_RA = adjusted_taxable_income_for_RA = (
    max(
        0,
        (
            total_annual_taxable_income
            - min(
                annual_ra_contribution,
                total_annual_taxable_income * DEDUCTIBLE_PERCENTAGE,
                ANNUAL_CAP_RATE,
            )
        ),
    )
    if (wrapper_type_to_analyse == "RA")
    else total_annual_taxable_income
)

gross_income_tax_payable = table_lookup(
    adjusted_taxable_income_for_RA, INCOME_TAX_TABLE, 2
) + (
    adjusted_taxable_income_for_RA
    - table_lookup(adjusted_taxable_income_for_RA, INCOME_TAX_TABLE, 4)
) * table_lookup(adjusted_taxable_income_for_RA, INCOME_TAX_TABLE, 3)

applicable_rate = (
    PRIMARY_REBATE_AMT
    + (SECONDARY_REBATE_AMT if client_age >= 65 else 0)
    + (TERIARY_REBATE_AMT if client_age >= 75 else 0)
)

clients_marginal_income_tax_rate = table_lookup(
    adjusted_taxable_income_for_RA, INCOME_TAX_TABLE, 3
)

interest_exemption = OVER_65_EXEMPTION if client_age >= 65 else UNDER_65_EXEMPTION

taxable_interest = max(0, sa_interest - sa_local_dividends)

tax_on_interest = taxable_interest * clients_marginal_income_tax_rate

tax_on_local_dividends_dwt = sa_local_dividends * DWT_RATE_LOCAL_NON_REIT

tax_on_reit_dividends = sa_reit_dividends * clients_marginal_income_tax_rate

tax_on_foreign_dividends = foreign_dividends * DWT_RATE_LOCAL_NON_REIT

net_realised_capital_gains_after_annual_exclusion = max(
    0, gross_realised_capital_gains - ANNUAL_EXCLUSION
)

taxable_portion_of_capital_gains = (
    net_realised_capital_gains_after_annual_exclusion * INCLUSION_RATE
)

tax_on_capital_gains = (
    taxable_portion_of_capital_gains * clients_marginal_income_tax_rate
)

total_tax_unwrapped = (
    tax_on_interest
    + tax_on_local_dividends_dwt
    + tax_on_reit_dividends
    + tax_on_foreign_dividends
    + tax_on_capital_gains
)

internal_tax_on_interest = 0

internal_tax_on_reit_dividends = (
    sa_reit_dividends * ENDOWMENT_INCOME_RATE
    if (wrapper_type_to_analyse == "Local or Foreign Note")
    else 0
)

internal_tax_on_local_dividends = (
    sa_local_dividends * DWT_RATE_LOCAL_NON_REIT
    if (wrapper_type_to_analyse == "Local or Foreign Note")
    else 0
)

internal_tax_on_foreign_dividends = (
    foreign_dividends * DWT_RATE_LOCAL_NON_REIT
    if (wrapper_type_to_analyse == "Local or Foreign Note")
    else 0
)

internal_tax_on_capital_gains = 0

total_tax_on_local_or_foreign_note = (
    internal_tax_on_interest
    + internal_tax_on_reit_dividends
    + internal_tax_on_local_dividends
    + internal_tax_on_foreign_dividends
    + internal_tax_on_capital_gains
)

cost_of_note = (
    total_investment_value * wrapper_annual_cost_eac
    if (wrapper_type_to_analyse == "Local or Foreign Note")
    else 0
)

total_cost_of_note = cost_of_note + total_tax_on_local_or_foreign_note

internal_tax_on_interest_endowment = (
    sa_interest * ENDOWMENT_INCOME_RATE
    if wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
    else 0
)
internal_tax_on_reit_dividends_endowment = (
    sa_reit_dividends * ENDOWMENT_INCOME_RATE
    if wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
    else 0
)
internal_tax_on_local_dividends_endowment = (
    foreign_dividends * DWT_RATE_LOCAL_NON_REIT
    if wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
    else 0
)
internal_tax_on_foreign_dividends_endowment = internal_tax_on_local_dividends_endowment  # TODO: clarify if this is a mistake (B59)
internal_tax_on_capital_gains_endowment = (
    gross_realised_capital_gains * ENDOWMENT_CGT_EFFECTIVE_RATE
    if wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
    else 0
)
total_internal_tax_endowment = (
    internal_tax_on_interest_endowment
    + internal_tax_on_reit_dividends_endowment
    + internal_tax_on_local_dividends_endowment
    + internal_tax_on_foreign_dividends_endowment
    + internal_tax_on_capital_gains_endowment
    if wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
    else 0
)  # TODO: also includes B5 on spreadsheet, clarify (B61)
wrapper_cost_endowment = (
    total_investment_value * wrapper_annual_cost_eac
    if wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
    else 0
)
total_cost_and_internal_tax_endowment = (
    total_internal_tax_endowment + wrapper_cost_endowment
)
upfront_tax_saving_endowment = 0  # TODO: B64 blank on excel

total_internal_tax_ra = 0
wrapper_cost_ra = (
    total_investment_value * wrapper_annual_cost_eac
    if wrapper_type_to_analyse == "RA"
    else 0
)
actual_ra_contribtution = (
    annual_ra_contribution if wrapper_type_to_analyse == "RA" else 0
)
max_deductible_ra_contribution = (
    min(
        actual_ra_contribtution,
        total_annual_taxable_income * DEDUCTIBLE_PERCENTAGE,
        ANNUAL_CAP_RATE,
    )
    if wrapper_type_to_analyse == "RA"
    else 0
)
upfront_tax_saving_from_ra_contribution = (
    max_deductible_ra_contribution * clients_marginal_income_tax_rate
    if wrapper_type_to_analyse == "RA"
    else 0
)
total_cost_and_internal_tax = wrapper_cost_ra

total_internal_tax_tfsa = 0
wrapper_cost_tfsa = (
    total_investment_value * wrapper_annual_cost_eac
    if wrapper_type_to_analyse == "TFSA"
    else 0
)
total_cost_and_internal_tax_tfsa = wrapper_cost_tfsa
upfront_tax_saving_tfsa = 0  # B78 is empty, fix?

total_tax_within_selected_wrapper = 0
if (
    wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
):
    total_tax_within_selected_wrapper = total_internal_tax_endowment
elif wrapper_type_to_analyse == "RA":
    total_tax_within_selected_wrapper = total_internal_tax_ra
elif wrapper_type_to_analyse == "Local or Foreign Note":
    total_tax_within_selected_wrapper = total_tax_on_local_or_foreign_note

monetary_cost_of_selected_wrapper = 0
if (
    wrapper_type_to_analyse == "Endowment"
    or wrapper_type_to_analyse == "Offshore Endowment"
):
    monetary_cost_of_selected_wrapper = wrapper_cost_endowment
elif wrapper_type_to_analyse == "RA":
    monetary_cost_of_selected_wrapper = wrapper_cost_ra
elif wrapper_type_to_analyse == "Local or Foreign Note":
    monetary_cost_of_selected_wrapper = cost_of_note

upfront_tax_saving_from_selected_wrapper = (
    upfront_tax_saving_from_ra_contribution if wrapper_type_to_analyse == "RA" else 0
)

net_return_unwrapped = gross_portfolio_return - total_tax_unwrapped
net_return_unwrapped_percentage = net_return_unwrapped / total_investment_value

net_return_wrapped = (
    gross_portfolio_return
    - total_tax_within_selected_wrapper
    - monetary_cost_of_selected_wrapper
    + upfront_tax_saving_from_selected_wrapper
)
net_return_wrapped_percentage = net_return_wrapped / total_investment_value

annual_yield_enhancement_monetary = net_return_wrapped - net_return_unwrapped
annual_yield_enhancement_percentage = (
    annual_yield_enhancement_monetary / total_investment_value
)
################################
############ OUTPUT ############
################################

print(
    f"Annual Yield Reduction/Enhancement - Monetary = R{annual_yield_enhancement_monetary}\nAnnual Yield Reduction/Enhancement - % of Investment Value = {annual_yield_enhancement_percentage * 100}%"
)

# DEBUG: list all variables
DEBUG = False

if DEBUG:
    for k, v in list(globals().items()):  # take a static copy of the dictionary
        if not k.startswith("__") and not callable(v):
            print(f"{k} = {v}")
