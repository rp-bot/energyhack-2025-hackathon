from flask import Flask, jsonify, request
import os
import requests
from dotenv import load_dotenv
import pprint
import json
import datetime
from collections import defaultdict
import pandas as pd


df = pd.read_csv("predicted_data/co2_per_kwh_2025.csv")


fuel_mapping = {
    'COL': 'Coal',
    'NG': 'Natural Gas',
    'PET': 'Petroleum',
    'NUC': 'Nuclear',
    'ALL': 'All Fuels',
}

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load API key from .env
API_KEY_RATES = os.getenv("OPENEI_API_KEY_RATES")
API_KEY_MIX = os.getenv("OPENEI_API_KEY_MIX")
GOOG_API = os.getenv("GOOG_API")

car_data = {
    "TeslaModelY": 75,
    "TeslaModel3": 60,
    "HyundaiIoniq5": 77,
    "HondaPrologue": 80,
    "FordF150Lightning": 98,
}


# @app.route("/get_hourly_mix", methods=["GET"])
def get_hourly_mix():
    url = "https://api.eia.gov/v2/electricity/rto/fuel-type-data/data/"
    # Calculate start and end dates
    end_date = datetime.datetime.now(datetime.timezone(
        datetime.timedelta(hours=-5))) - datetime.timedelta(days=6)
    start_date = end_date - datetime.timedelta(days=1)

    params = {
        "frequency": "hourly",
        "data[0]": "value",
        "facets[respondent][]": "SOCO",
        "facets[fueltype][]": ["COL", "NG", "PET", "OIL"],
        "start": start_date.strftime("%Y-%m-%dT%H"),
        "end": end_date.strftime("%Y-%m-%dT%H"),
        "sort[0][column]": "period",
        "sort[0][direction]": "desc",
        "offset": 0,
        "length": 5000,
        "api_key": API_KEY_MIX
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        data = response.json().get("response", {}).get("data", [])

        # Group data by period and calculate fuel type mix
        mix_by_hour = defaultdict(lambda: defaultdict(float))

        for entry in data:
            period = entry.get("period")
            fuel_type = entry.get("fueltype")
            value = float(entry.get("value", 0))
            mix_by_hour[period][fuel_type] += value

        # Calculate percentages and total generation
        mix_summary = []
        for period, fuels in mix_by_hour.items():
            total = sum(fuels.values())
            mix_summary.append({
                "time": period,
                "total_generation_mwh": round(total, 2),
                "fuel_mix_percentages": [
                    {"fuel_type": fuel, "percentage": round(
                        (value / total) * 100, 2) if total > 0 else 0}
                    for fuel, value in fuels.items()
                ]
            })

        return mix_summary
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"status": "error", "message": f"HTTP error occurred: {http_err}"}), 500
    except Exception as err:
        return jsonify({"status": "error", "message": f"An error occurred: {err}"}), 500


@app.route('/get_least_co2_emissions', methods=['GET'])
def get_least_co2_emissions():
    latitude = request.args.get("lat", 33.8398137, type=float)
    longitude = request.args.get("lon", -84.3798137, type=float)

    car_name = request.args.get("car_name", "TeslaModel3", type=str)

    daily_mix = get_hourly_mix()
    state = get_state_from_coordinates(latitude, longitude, GOOG_API)
    final_mix = []

    for hourly_mix in daily_mix:
        temp_array_sums = []
        temp_array_fuel_types = []
        for hourly_percentage in hourly_mix["fuel_mix_percentages"]:
            fuel_type = hourly_percentage["fuel_type"]
            try:
                fuel_type = fuel_mapping[fuel_type]
            except KeyError:
                continue
            percentage = hourly_percentage["percentage"]
            per_hour_usage = percentage*10

            state_row = df[df["state-name"] == state]
            state_fuel_row = state_row[state_row["fuel-name"] == fuel_type]
            try:
                co2_per_kwh = state_fuel_row["co2_per_kwh"].values[0]
            except IndexError:
                continue
            temp_array_sums.append(per_hour_usage*co2_per_kwh*1e-2)
            temp_array_fuel_types.append(fuel_type)

        temp_dict = {}
        for i, fuel_type in enumerate(temp_array_fuel_types):
            temp_dict[fuel_type] = temp_array_sums[i]

        temp_dict["sum"] = sum(temp_array_sums)

        final_mix.append(temp_dict)

        final_mix_df = pd.DataFrame(final_mix)

        # Find the 10-hour moving sum for the 'sum' column
        rolling_sums = final_mix_df['sum'].rolling(window=10).sum()

        # Drop NaN values (first 9 values will be NaN due to rolling window)
        # rolling_sums = rolling_sums.dropna()

        # Find min, max, and range
        min_sum = rolling_sums.min()

        min_index = rolling_sums.idxmin()

        range_of_sums = [min_index - 9, min_index]

    return jsonify({"mix": final_mix, "state": state, "least_co2_emissions": min_sum, "least_co2_range": range_of_sums, "car_name": car_name})


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


# @app.route("/get_annual_mix", methods=["GET"])
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

        # mix_summary = {}
        # for period, fuels in mix_by_hour.items():
        #     total = sum(fuels.values())
        #     mix_summary[period] = {
        #         "total_generation_mwh": round(total, 2),
        #         "fuel_mix_percentages": {
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
    # Dynamic latitude and longitude inputs with default values
    lat = request.args.get("lat", 33.8398137, type=float)
    lon = request.args.get("lon", -84.3795589, type=float)

    car_name = request.args.get("car_name", "TeslaModel3", type=str)
    # http://localhost:5000/get_hourly_rates?lat=33.8398137&lon=-84.3795589&make=TeslaModel3

    # print(lat)
    # print(lon)
    # print(car_name)

    # OpenEI API endpoint
    api_url = "https://api.openei.org/utility_rates"

    params = {
        "version": 3,
        "format": "json",
        "api_key": API_KEY_RATES,
        "direction": "desc",
        "limit": 1,
        "sector": "Residential",
        "lat": lat,
        "lon": lon,
        "detail": "full"
    }

    try:
        # Call the OpenEI API
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])
        extracted_data = []

        for item in items:
            extracted_data.append({
                "energyratestructure": item.get("energyratestructure"),
                "energyweekdayschedule": item.get("energyweekdayschedule"),
                "energyweekendschedule": item.get("energyweekendschedule")
            })

        return jsonify(extracted_data)

    except requests.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_state_from_coordinates(lat, lng, api_key):
    # Base URL for Google Maps Geocoding API
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"

    # Define parameters for the API request
    params = {
        "latlng": f"{lat},{lng}",
        "key": api_key
    }

    # Make the API request
    response = requests.get(base_url, params=params)
    result = response.json()

    # Parse the response to extract the state
    if result.get("status") == "OK":
        for component in result["results"][0]["address_components"]:
            if "administrative_area_level_1" in component["types"]:
                return component["long_name"]  # Return the state name
    return "State not found"


if __name__ == "__main__":
    # get_the_least_emissions()
    app.run(debug=True)
