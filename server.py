from flask import Flask, jsonify, request
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load API key from .env
API_KEY = os.getenv("OPENEI_API_KEY")


@app.route("/get_hourly_rates", methods=["GET"])
def get_hourly_rates():
    # Dynamic ZIP code input with a default value
    zip_code = request.args.get("zip", "30332")

    # Dynamic limit input with a default of 10
    # limit = request.args.get("limit", 10)

    # OpenEI API endpoint
    api_url = "https://api.openei.org/utility_rates"

    params = {
        "version": 3,
        "format": "json",
        "api_key": API_KEY,
        "zip": zip_code,
        "getpageoffset": 0,    # Start from the first result
        "getpage": 10       # Number of results to fetch
    }

    try:
        # Call the OpenEI API
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()
        print(data)
        hourly_rates = None
        # Filter for time-of-use/hourly rates
        # hourly_rates = [
        #     {
        #         "utility_name": item.get("utility_name"),
        #         "rate_name": item.get("rate_name"),
        #         "energyratestructure": item.get("energyratestructure"),
        #         "energyweekdayschedule": item.get("energyweekdayschedule"),
        #         "energyweekendschedule": item.get("energyweekendschedule"),
        #     }
        #     for item in data.get("items", [])
        #     if item.get("energyratestructure") and item.get("energyweekdayschedule")
        # ]

        # if not hourly_rates:
        #     return jsonify({"message": "No hourly or time-of-use rates found for this ZIP code."})

        return jsonify(hourly_rates)

    except requests.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
