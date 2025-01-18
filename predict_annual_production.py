import json
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
import matplotlib.pyplot as plt

# Load JSON data
with open('json_data/annual_MIX.json', 'r') as file:
    data = json.load(file)

# Extract data
records = data['data']

# Convert to DataFrame
df = pd.DataFrame(records)

# Convert relevant columns to appropriate data types
df['period'] = df['period'].astype(int)
df['consumption-for-eg-btu'] = pd.to_numeric(
    df['consumption-for-eg-btu'], errors='coerce')

# Filter data by year (2001-2023)
df = df[(df['period'] >= 2010)]

# Conversion factor from MMBtu to Kwh
MMBtu_to_KWh = 293.07107 * 1_000_000

# Convert BTU to Kwh
df['energy_production_KWh'] = df['consumption-for-eg-btu'] * MMBtu_to_KWh

# Select relevant columns for analysis
result_df = df[['period', 'location', 'stateDescription',
                'fueltypeid', 'energy_production_KWh']]

# Select relevant columns for analysis
result_df = df[['period', 'location', 'stateDescription',
                'fueltypeid', 'energy_production_KWh']]

# Forecast function for energy production


def forecast_energy_production(data, start_year=2023, end_year=2025):
    forecasts = []

    # Group by state and fuel type
    for (state, fuel), group in data.groupby(['stateDescription', 'fueltypeid']):
        X = group['period'].values.reshape(-1, 1)
        y = group['energy_production_KWh'].values

        # Fit linear regression
        model = LinearRegression().fit(X, y)

        # Predict for future years
        for year in range(start_year, end_year + 1):
            prediction = model.predict(np.array([[year]]))[0]
            forecasts.append({
                'stateDescription': state,
                'fueltypeid': fuel,
                'period': year,
                'predicted_energy_production_KWh': max(prediction, 0)
            })

    return pd.DataFrame(forecasts)


# Generate predictions for 2023-2025
predictions_df = forecast_energy_production(result_df)

# Save predictions to CSV
predictions_df.to_csv('predicted_energy_production_2023_2025.csv', index=False)

# Filter results for the year 2025
# pred_results_df = result_df[result_df['period'] == 2025]
# # Save the processed data to a CSV file
# pred_results_df.to_csv('annual_energy_production_KWh.csv', index=False)

# print("Conversion complete. Data saved to 'annual_energy_production_KWh.csv'.")

# Function to plot energy production over the years with predictions


def plot_energy_trend(state, energy_source):
    # Filter data by state and energy source
    filtered_df = result_df[(result_df['stateDescription'] == state) &
                            (result_df['fueltypeid'] == energy_source)]

    # Prepare data for prediction
    X = filtered_df['period'].values.reshape(-1, 1)
    y = filtered_df['energy_production_KWh'].values

    # Fit model
    model = LinearRegression()
    model.fit(X, y)

    # Predict for 2023 to 2025
    future_years = np.array([[2024], [2025]])
    future_predictions = model.predict(future_years)

    # Plotting
    plt.figure(figsize=(10, 6))
    plt.plot(filtered_df['period'], filtered_df['energy_production_KWh'],
             marker='o', label='Historical Data')
    plt.plot(future_years.flatten(), future_predictions, marker='x',
             linestyle='--', color='red', label='Predictions (2023-2025)')
    plt.xlabel('Year')
    plt.ylabel('Energy Production (KWh)')
    plt.title(f'Energy Production Trend for {state} - {energy_source}')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()


if __name__ == '__main__':
    # Example usage
    plot_energy_trend('Arizona', 'SUN')
