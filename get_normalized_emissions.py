import pandas as pd

# Load the CSV files
co2_df = pd.read_csv('predicted_data/co2_emissions_forecast_2023_2025.csv')
energy_df = pd.read_csv(
    'predicted_data/predicted_energy_production_2023_2025.csv')

# Filter for the year 2025
co2_2025 = co2_df[co2_df['period'] == 2025].copy()
energy_2025 = energy_df[energy_df['period'] == 2025]

# Map fuel names to match between datasets
fuel_mapping = {
    'Coal': 'COL',
    'Natural Gas': 'NG',
    'Petroleum': 'PET',
    'Nuclear': 'NUC',
    'All Fuels': 'ALL'
}

# Apply the mapping to the CO2 data using .loc to avoid SettingWithCopyWarning
co2_2025.loc[:, 'fueltypeid'] = co2_2025['fuel-name'].map(fuel_mapping)

# Merge datasets on state and fuel type, including 'period' explicitly
merged_df = pd.merge(co2_2025, energy_2025, how='inner', left_on=[
                     'state-name', 'fueltypeid', 'period'], right_on=['stateDescription', 'fueltypeid', 'period'])
print(merged_df)
# Calculate CO2 emissions per kWh
merged_df['co2_per_kwh'] = merged_df['predicted_value'] / \
    merged_df['predicted_energy_production_KWh']

# Select relevant columns for output
result_df = merged_df[['state-name', 'fuel-name', 'period', 'co2_per_kwh']]

# Save the result to a new CSV
result_df.to_csv('co2_per_kwh_2025.csv', index=False)
