# TODO List
# Typing
# Use best practice
# Create functions
import json
import os

import boto3
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": "*"}})

ENABLE_AI = False


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
            continue
        break
    return result


def get_ai_response(test_payload):
    # Load environment variables from .env
    load_dotenv()

    AWS_REGION = os.getenv("AWS_REGION")
    MODEL_ID = os.getenv("BEDROCK_MODEL_ID")

    # Create Boto3 client for Bedrock
    client = boto3.client(
        "bedrock-runtime",
        region_name=AWS_REGION,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

    # Create a prompt asking Claude to summarize
    prompt = f"""
    You are a Sanlam Financial Markets tax efficiency advisor AI. Your role is to analyze yield reduction calculations and explain the results in clear, client-friendly terms that portfolio managers can use when presenting investment options.

    Based on the following investment scenario data, provide a comprehensive analysis:

    **Client Profile:**
    - Age: {test_payload["client"]["age"]} years
    - Annual taxable income: R{test_payload["client"]["annual_taxable_income_before_RA"]:,}
    - RA contribution: R{test_payload["client"]["RA_contribution"]:,}

    **Investment Details:**
    - Total investment value: R{test_payload["investment"]["total_value"]:,}
    - Expected gross annual return: {test_payload["investment"]["gross_annual_return"] * 100:.1f}%
    - Wrapper type: {test_payload["wrapper"]["type"]}

    **Key Results:**
    - Net return without wrapper: R{test_payload["yield"]["net_return_unwrapped"]:,}
    - Net return with wrapper: R{test_payload["yield"]["net_return_wrapped"]:,}
    - Annual benefit: R{test_payload["yield"]["yield_difference_monetary"]:,}
    - Yield improvement: {test_payload["yield"]["yield_difference_percent"] * 100:.3f}%

    Please provide:

    1. **Executive Summary** (2-3 sentences): The key benefit and yield improvement in simple terms

    2. **Tax Impact Breakdown**: Explain how different taxes affect this client's returns (use the detailed tax data provided)

    3. **Wrapper Benefits**: Clearly explain why the {test_payload["wrapper"]["type"]} wrapper is beneficial for this client

    4. **Client-Friendly Explanation**: Translate into language a client would understand, focusing on:
       - Annual rand value of tax savings
       - What this means for their wealth over time
       - Key advantages of using the wrapper

    5. **Portfolio Manager Talking Points**: 3-4 key phrases the PM can use to highlight the product's tax efficiency advantage

    Keep explanations concise, use South African tax context, and focus on demonstrating clear value proposition in rand terms.

    Full calculation data:
    {json.dumps(test_payload, indent=2)}
    """

    print("Sending payload to Claude...")
    return invoke_model(prompt=prompt, model_id=MODEL_ID, client=client)


def invoke_model(prompt: str, model_id, client):
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": prompt}],
    }

    response = client.invoke_model(
        modelId=model_id,
        contentType="application/json",
        body=json.dumps(payload).encode("utf-8"),
    )

    result = json.loads(response["body"].read().decode("utf-8"))
    return result["content"][0]["text"]


@app.route("/calculate")
def get_calculation():
    # e.g http://127.0.0.1:5000/calculate?client_age=55&total_investment_value=20000000
    return calculate(
        DEBUG=False,
        client_age=float(request.args.get("clientAge", 55)),
        total_annual_taxable_income=float(
            request.args.get("totalAnnualTaxableIncome", 5000000)
        ),
        total_investment_value=float(
            request.args.get("totalInvestmentValue", 20000000)
        ),
        gross_annual_portfolio_return=float(
            request.args.get("grossAnnualPortfolioReturn", 0.1)
        ),
        return_from_sa_interest=float(request.args.get("returnFromSaInterest", 0)),
        return_from_sa_local_dividends=float(
            request.args.get("returnFromSaLocalDividends", 0.05)
        ),
        return_from_local_sa_reit_dividends=float(
            request.args.get("returnFromLocalSaReitDividends", 0.02)
        ),
        return_from_foreign_dividends=float(
            request.args.get("returnFromForeignDividends", 0.05)
        ),
        return_from_local_capital_growth=float(
            request.args.get("returnFromLocalCapitalGrowth", 0.78)
        ),
        average_portfolio_turnover=float(
            request.args.get("averagePortfolioTurnover", 0.3)
        ),
        assumed_realised_gain_on_turnover=float(
            request.args.get("assumedRealisedGainOnTurnover", 0.1)
        ),
        wrapper_type_to_analyse=request.args.get(
            "wrapperTypeToAnalyse", "Local or Foreign Note"
        ),
        wrapper_annual_cost_eac=float(request.args.get("wrapperAnnualCostEac", 0.0035)),
        annual_ra_contribution=float(request.args.get("annualRaContribution", 350000)),
    )


def calculate(
    DEBUG,
    client_age,
    total_annual_taxable_income,
    total_investment_value,
    gross_annual_portfolio_return,
    return_from_sa_interest,
    return_from_sa_local_dividends,  # (non-REIT)
    return_from_local_sa_reit_dividends,
    return_from_foreign_dividends,
    return_from_local_capital_growth,
    average_portfolio_turnover,
    assumed_realised_gain_on_turnover,
    wrapper_type_to_analyse,  # TODO: enum
    wrapper_annual_cost_eac,
    annual_ra_contribution,  # (if RA is selected)
):
    ################################
    ###### TAX DATA CONSTANTS ######
    ################################
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
        upfront_tax_saving_from_ra_contribution
        if wrapper_type_to_analyse == "RA"
        else 0
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

    test_payload = {
        "client": {
            "age": client_age,
            "annual_taxable_income_before_RA": total_annual_taxable_income,
            "RA_contribution": annual_ra_contribution,
        },
        "investment": {
            "total_value": total_investment_value,
            "gross_annual_return": gross_annual_portfolio_return,
            "return_breakdown": {
                "SA_interest": sa_interest,
                "SA_local_dividends": sa_local_dividends,
                "SA_REIT_dividends": sa_reit_dividends,
                "foreign_dividends": foreign_dividends,
                "capital_growth": return_from_local_capital_growth,
            },
            "portfolio_turnover": gross_portfolio_return,
            "realised_gain_on_turnover": net_realised_capital_gains_after_annual_exclusion,  # ?
        },
        "wrapper": {
            "type": wrapper_type_to_analyse,
            "EAC": wrapper_annual_cost_eac,
            "internal_tax": {
                "interest": internal_tax_on_interest,
                "local_dividends": internal_tax_on_local_dividends,
                "REIT_dividends": internal_tax_on_reit_dividends,
                "foreign_dividends": internal_tax_on_foreign_dividends,
                "capital_gains": internal_tax_on_capital_gains,
            },
            "wrapper_cost": wrapper_annual_cost_eac,  # ?
            "total_cost_and_tax": total_cost_and_internal_tax,
        },
        "tax": {
            "gross_income_tax": gross_income_tax_payable,
            "rebate": applicable_rate,
            "marginal_rate": clients_marginal_income_tax_rate,
            "interest_exemption": interest_exemption,
            "tax_on_interest": tax_on_interest,
            "tax_on_local_dividends": tax_on_local_dividends_dwt,
            "tax_on_REIT_dividends": tax_on_reit_dividends,
            "tax_on_foreign_dividends": tax_on_foreign_dividends,
            "capital_gains": {
                "net_realised": net_realised_capital_gains_after_annual_exclusion,
                "taxable_portion": taxable_portion_of_capital_gains,
                "tax_due": tax_on_capital_gains,
            },
            "total_tax_unwrapped": total_tax_unwrapped,
            "total_tax_wrapped": total_tax_within_selected_wrapper,
        },
        "yield": {
            "net_return_unwrapped": net_return_unwrapped,
            "net_return_wrapped": net_return_wrapped,
            "yield_difference_monetary": annual_yield_enhancement_monetary,
            "yield_difference_percent": annual_yield_enhancement_percentage,
        },
    }
    ################################
    ############ OUTPUT ############
    ################################

    print(
        f"Annual Yield Reduction/Enhancement - Monetary = R{annual_yield_enhancement_monetary}\nAnnual Yield Reduction/Enhancement - % of Investment Value = {annual_yield_enhancement_percentage * 100}%"
    )

    # DEBUG: list all variables
    if DEBUG:
        for k, v in list(globals().items()):  # take a static copy of the dictionary
            if not k.startswith("__") and not callable(v):
                print(f"{k} = {v}")

    ai_response = get_ai_response(test_payload) if ENABLE_AI else "AI OVERVIEW DISABLED"

    return jsonify(
        {
            "yieldReductionEnhancement": annual_yield_enhancement_monetary,
            "yieldReductionEnhancementPercent": annual_yield_enhancement_percentage,
            "grossPortfolioReturn": gross_annual_portfolio_return,
            "saInterest": sa_interest,
            "saLocalDividends": sa_local_dividends,
            "saReitDividends": sa_reit_dividends,
            "foreignDividends": foreign_dividends,
            "grossRealisedCapitalGains": gross_realised_capital_gains,
            "adjustedTaxableIncomeForRa": adjusted_taxable_income_for_RA,
            "grossIncomeTaxPayable": gross_income_tax_payable,
            "applicableRebate": applicable_rate,
            "clientsMarginalIncomeTaxRate": clients_marginal_income_tax_rate,
            "interestExemption": interest_exemption,
            "taxableInterest": taxable_interest,
            "taxOnInterest": tax_on_interest,
            "taxOnSaLocalDividendsDwt": tax_on_local_dividends_dwt,
            "taxOnSaReitDividends": tax_on_reit_dividends,
            "taxOnForeignDividends": tax_on_foreign_dividends,
            "netRealisedCapitalGainsAfterAnnualExclusion": net_realised_capital_gains_after_annual_exclusion,
            "taxablePortionOfCapitalGains": taxable_portion_of_capital_gains,
            "taxOnCapitalGains": tax_on_capital_gains,
            "totalTaxUnwrapped": total_tax_unwrapped,
            "internalTaxOnInterest": internal_tax_on_interest,
            "internalTaxOnReitDividends": internal_tax_on_reit_dividends,
            "internalTaxOnLocalDividends": internal_tax_on_local_dividends,
            "internalTaxOnForeignDividends": internal_tax_on_foreign_dividends,
            "internalTaxOnCapitalGains": internal_tax_on_capital_gains,
            "totalInternalTaxLocalOrForeignNote": total_tax_on_local_or_foreign_note,
            "wrapperCost": wrapper_annual_cost_eac,
            "totalCostAndInternalTax": total_cost_and_internal_tax,
            "totalTaxWithinSelectedWrapper": total_tax_within_selected_wrapper,
            "monetaryCostOfSelectedWrapper": monetary_cost_of_selected_wrapper,
            "upfrontTaxSavingFromSelectedWrapper": upfront_tax_saving_from_selected_wrapper,
            "netReturnUnwrapped": net_return_unwrapped,
            "netReturnUnwrappedPercentage": net_return_unwrapped_percentage,
            "netReturnWrapped": net_return_wrapped,
            "netReturnWrappedPercentage": net_return_wrapped_percentage,
            "aiResponse": ai_response,
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
