from flask import Flask, jsonify, request
import os
import requests
from dotenv import load_dotenv
import pprint
import json
import datetime
from collections import defaultdict

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load API key from .env
API_KEY_RATES = os.getenv("OPENEI_API_KEY_RATES")
API_KEY_MIX = os.getenv("OPENEI_API_KEY_MIX")


@app.route('/get_co2_emissions', methods=['GET'])
def get_co2_emissions():
    url = "https://api.eia.gov/v2/co2-emissions/co2-emissions-aggregates/data/"

    params = {
        'frequency': 'annual',
        'data[0]': 'value',
        'facets[sectorId][]': 'EC',
        'start': '2000',
        'end': '2022',
        'sort[0][column]': 'period',
        'sort[0][direction]': 'desc',
        'offset': 0,
        'length': 5000,
        'api_key': API_KEY_MIX
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        with open("co2_data.json", "w") as f:
            f.write(str(response.json()))
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_annual_mix", methods=["GET"])
def get_annual_consumption():
    url = "https://api.eia.gov/v2/electricity/electric-power-operational-data/data/"
    params = {
        "frequency": "annual",
        "data[0]": "consumption-for-eg-btu",
        "facets[fueltypeid][]": ["COL", "NG", "NUC", "PET", "SUN", "WND"],
        "facets[location][]": [
            "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA",
            "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD",
            "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
            "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"
        ],
        "facets[sectorid][]": ["98"],  # Specific sector filter
        "start": "2010",
        "end": "2024",
        "sort[0][column]": "period",
        "sort[0][direction]": "asc",
        "offset": 0,
        "length": 5000,
        "api_key": API_KEY_MIX
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json().get("response", {}).get("data", [])

        # Group data by year and calculate fuel type consumption
        # consumption_by_year = defaultdict(lambda: defaultdict(float))

        with open("annual_MIX.json", "w") as f:
            json.dump({"data": data}, f, indent=4)

        # # Calculate total consumption and percentages
        # consumption_summary = {}
        # for period, fuels in consumption_by_year.items():
        #     total = sum(fuels.values())
        #     consumption_summary[period] = {
        #         "total_consumption_btu": round(total, 2),
        #         "fuel_consumption_percentages": {
        #             fuel: round((value / total) * 100, 2) if total > 0 else 0
        #             for fuel, value in fuels.items()
        #         }
        #     }

        return jsonify({"status": "success"})
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"status": "error", "message": f"HTTP error occurred: {http_err}"}), 500
    except Exception as err:
        return jsonify({"status": "error", "message": f"An error occurred: {err}"}), 500


@app.route("/get_hourly_rates", methods=["GET"])
def get_hourly_rates():
    # Dynamic ZIP code input with a default value
    # zip_code = request.args.get("zip", "30332")

    # Dynamic limit input with a default of 10
    # limit = request.args.get("limit", 10)

    # OpenEI API endpoint
    api_url = "https://api.openei.org/utility_rates"

    params = {
        "version": 3,
        "format": "json",
        "api_key": API_KEY_RATES,
        "direction": "desc",
        "limit": 1,
        "sector": "Residential",
        "lat": 33.775620,
        "lon": -84.396286,
        "detail": "full"
    }

    try:
        # Call the OpenEI API
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()
        # print(data)
        with open('data.json', 'w') as json_file:
            json.dump(data, json_file, indent=4)

        # useful_data = {
        #     "utility": data["items"][0]["utility"],
        #     "startdate": datetime.datetime.utcfromtimestamp(data["items"][0]["startdate"]).strftime('%Y-%m-%d %H:%M:%S'),
        #     "energyratestructure": data["items"][0]["energyratestructure"],
        #     "energyweekdayschedule": data["items"][0]["energyweekdayschedule"],
        #     "energyweekendschedule": data["items"][0]["energyweekendschedule"]
        # }

        # if not hourly_rates:
        #     return jsonify({"message": "No hourly or time-of-use rates found for this ZIP code."})

        return jsonify(data)

    except requests.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
