from flask import Flask, jsonify, request
import os
import requests
from dotenv import load_dotenv
import pprint
import json
import datetime

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
        "direction":"desc",
        "limit":3,
        "lat": 33.775620,
        "lon":-84.396286,
        "detail":"full"
        
    }

    try:
        # Call the OpenEI API
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()
        # print(data)
        with open('data.json', 'w') as json_file:
            json.dump(data, json_file, indent=4)
            
        
        useful_data= {
            "utility":data["items"][0]["utility"],
            "startdate":datetime.datetime.utcfromtimestamp(data["items"][0]["startdate"]).strftime('%Y-%m-%d %H:%M:%S'),
            "energyratestructure":data["items"][0]["energyratestructure"],
            "energyweekdayschedule":data["items"][0]["energyweekdayschedule"],
            "energyweekendschedule":data["items"][0]["energyweekendschedule"]
        }
  

        # if not hourly_rates:
        #     return jsonify({"message": "No hourly or time-of-use rates found for this ZIP code."})

        return jsonify(useful_data)

    except requests.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
