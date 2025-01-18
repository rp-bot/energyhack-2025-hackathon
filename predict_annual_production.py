import json
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
import matplotlib.pyplot as plt

# Load JSON data
with open('annual_MIX.json', 'r') as file:
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

# Conversion factor from MMBtu to MWh
MMBtu_to_MWh = 0.29307107

# Convert BTU to MWh
df['energy_production_MWh'] = df['consumption-for-eg-btu'] * MMBtu_to_MWh

# Select relevant columns for analysis
result_df = df[['period', 'location', 'stateDescription',
                'fueltypeid', 'energy_production_MWh']]

# Group by year and calculate average energy production
yearly_avg = result_df.groupby(
    'period')['energy_production_MWh'].mean().reset_index()

# Predict 2023-2025 energy production using Linear Regression
X = yearly_avg['period'].values.reshape(-1, 1)
y = yearly_avg['energy_production_MWh'].values

model = LinearRegression()
model.fit(X, y)

# Predict for 2023 to 2025
future_years = np.array([[2024], [2025]])
future_predictions = model.predict(future_years)

for year, prediction in zip(future_years.flatten(), future_predictions):
    print(f"Predicted average energy production for {
          year}: {prediction:.2f} MWh")

# Save the processed data to a CSV file
result_df.to_csv('annual_energy_production_MWh.csv', index=False)

print("Conversion complete. Data saved to 'annual_energy_production_MWh.csv'.")

# Function to plot energy production over the years with predictions


def plot_energy_trend(state, energy_source):
    # Filter data by state and energy source
    filtered_df = result_df[(result_df['stateDescription'] == state) &
                            (result_df['fueltypeid'] == energy_source)]

    # Prepare data for prediction
    X = filtered_df['period'].values.reshape(-1, 1)
    y = filtered_df['energy_production_MWh'].values

    # Fit model
    model = LinearRegression()
    model.fit(X, y)

    # Predict for 2023 to 2025
    future_years = np.array([[2024], [2025]])
    future_predictions = model.predict(future_years)

    # Plotting
    plt.figure(figsize=(10, 6))
    plt.plot(filtered_df['period'], filtered_df['energy_production_MWh'],
             marker='o', label='Historical Data')
    plt.plot(future_years.flatten(), future_predictions, marker='x',
             linestyle='--', color='red', label='Predictions (2023-2025)')
    plt.xlabel('Year')
    plt.ylabel('Energy Production (MWh)')
    plt.title(f'Energy Production Trend for {state} - {energy_source}')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()


if __name__ == '__main__':
    # Example usage
    plot_energy_trend('Arizona', 'SUN')
