import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import json

# Load JSON data (Replace 'data.json' with your actual JSON file)
with open('co2_data.json') as f:
    json_data = json.load(f)

# Convert JSON data to DataFrame
data = pd.json_normalize(json_data['response']['data'])

# Convert data types
data['period'] = data['period'].astype(int)
data['value'] = data['value'].astype(float)

# Save the DataFrame to a CSV file for future use
data.to_csv('co2_emissions_data.csv', index=False)

# Function to forecast emissions for each state and fuel type


def forecast_emissions(data, start_year=2023, end_year=2025):
    forecasts = []

    # Group by state and fuel type
    for (state, fuel), group in data.groupby(['state-name', 'fuel-name']):
        X = group['period'].values.reshape(-1, 1)
        y = group['value'].values

        # Fit linear regression
        model = LinearRegression().fit(X, y)

        # Predict for future years
        for year in range(start_year, end_year + 1):
            prediction = model.predict(np.array([[year]]))[0]
            forecasts.append({
                'state-name': state,
                'fuel-name': fuel,
                'period': year,
                # Avoid negative predictions
                'predicted_value': max(prediction, 0)
            })

    return pd.DataFrame(forecasts)


# Generate forecast
forecast_df = forecast_emissions(data)

# Save forecast to CSV
forecast_df.to_csv('co2_emissions_forecast_2023_2025.csv', index=False)

# Optional: Plot forecasts for a specific state and fuel type


def plot_forecast(state, fuel):
    historical = data[(data['state-name'] == state)
                      & (data['fuel-name'] == fuel)]
    forecast = forecast_df[(forecast_df['state-name'] == state)
                           & (forecast_df['fuel-name'] == fuel)]

    plt.figure(figsize=(10, 6))
    plt.plot(historical['period'], historical['value'],
             label='Historical', marker='o')
    plt.plot(forecast['period'], forecast['predicted_value'],
             label='Forecast', marker='x', linestyle='--')
    plt.xlabel('Year')
    plt.ylabel('CO2 Emissions (Million Metric Tons)')
    plt.title(f'{state} - {fuel} CO2 Emissions Forecast')
    plt.legend()
    plt.grid(True)
    plt.show()

if __name__ == "__main__":

# Example plot for Ohio Coal
    plot_forecast('Georgia', 'Coal')
