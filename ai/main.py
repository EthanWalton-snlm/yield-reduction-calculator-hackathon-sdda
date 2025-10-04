import json
import os

import boto3
from dotenv import load_dotenv

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


def invoke_model(prompt: str):
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": prompt}],
    }

    response = client.invoke_model(
        modelId=MODEL_ID,
        contentType="application/json",
        body=json.dumps(payload).encode("utf-8"),
    )

    result = json.loads(response["body"].read().decode("utf-8"))
    return result["content"][0]["text"]


if __name__ == "__main__":
    test_payload = {
        "client": {
            "age": 55,
            "annual_taxable_income_before_RA": 5000000,
            "RA_contribution": 350000,
        },
        "investment": {
            "total_value": 20000000,
            "gross_annual_return": 0.10,
            "return_breakdown": {
                "SA_interest": 0.00,
                "SA_local_dividends": 0.05,
                "SA_REIT_dividends": 0.02,
                "foreign_dividends": 0.05,
                "capital_growth": 0.78,
            },
            "portfolio_turnover": 0.30,
            "realised_gain_on_turnover": 0.10,
        },
        "wrapper": {
            "type": "Local or Foreign Note",
            "EAC": 0.0035,
            "internal_tax": {
                "interest": 0,
                "local_dividends": 20000,
                "REIT_dividends": 12000,
                "foreign_dividends": 20000,
                "capital_gains": 0,
            },
            "wrapper_cost": 70000,
            "total_cost_and_tax": 122000,
        },
        "tax": {
            "gross_income_tax": 2076839,
            "rebate": 17235,
            "marginal_rate": 0.45,
            "interest_exemption": 23800,
            "tax_on_interest": 0,
            "tax_on_local_dividends": 20000,
            "tax_on_REIT_dividends": 18000,
            "tax_on_foreign_dividends": 20000,
            "capital_gains": {
                "net_realised": 560000,
                "taxable_portion": 224000,
                "tax_due": 100800,
            },
            "total_tax_unwrapped": 158800,
            "total_tax_wrapped": 52000,
        },
        "yield": {
            "net_return_unwrapped": 1841200,
            "net_return_wrapped": 1878000,
            "yield_difference_monetary": 36800,
            "yield_difference_percent": 0.00184,
        },
    }

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
    output = invoke_model(prompt)
    print("\n=== AI Summary ===")
    print(output)
