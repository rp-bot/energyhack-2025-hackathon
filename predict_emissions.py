import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import StandardScaler
import numpy as np

# Load dataset (replace with the actual CSV file path)
data = pd.read_csv('co2_emissions.csv')  # Ensure it has relevant columns

# Convert 'period' to integer
data['period'] = data['period'].astype(int)

# One-hot encode categorical features
data_encoded = pd.get_dummies(data, columns=['state-name', 'fuel-name'])

# Normalize features
scaler = StandardScaler()
X = data_encoded.drop(['value', 'period'], axis=1)
X['period'] = data_encoded['period']
X_scaled = scaler.fit_transform(X)
y = data_encoded['value'].astype(float).values

# Convert to PyTorch tensors
X_tensor = torch.tensor(X_scaled, dtype=torch.float32)
y_tensor = torch.tensor(y, dtype=torch.float32).view(-1, 1)

# Define a simple neural network model
class LinearRegressionModel(nn.Module):
    def __init__(self, input_dim):
        super(LinearRegressionModel, self).__init__()
        self.linear = nn.Linear(input_dim, 1)
    
    def forward(self, x):
        return self.linear(x)

# Initialize model, loss function, and optimizer
input_dim = X_tensor.shape[1]
model = LinearRegressionModel(input_dim)
criterion = nn.MSELoss()
optimizer = optim.SGD(model.parameters(), lr=0.01)

# Train the model
epochs = 1000
for epoch in range(epochs):
    model.train()
    optimizer.zero_grad()
    outputs = model(X_tensor)
    loss = criterion(outputs, y_tensor)
    loss.backward()
    optimizer.step()
    
    if (epoch + 1) % 100 == 0:
        print(f'Epoch {epoch+1}/{epochs}, Loss: {loss.item()}')

# Forecast function using PyTorch model
def forecast_emissions_torch(model, scaler, X, start_year=2023, end_year=2025):
    results = []
    for year in range(start_year, end_year + 1):
        future_X = X.copy()
        future_X['period'] = year
        future_X_scaled = scaler.transform(future_X)
        future_X_tensor = torch.tensor(future_X_scaled, dtype=torch.float32)
        
        model.eval()
        with torch.no_grad():
            predictions = model(future_X_tensor).numpy().flatten()
        
        # Store results
        for idx, prediction in enumerate(predictions):
            results.append({
                'period': year,
                'predicted_value': prediction,
                'details': future_X.iloc[idx].to_dict()
            })
    return pd.DataFrame(results)

# Run the forecast
forecast_df = forecast_emissions_torch(model, scaler, X)

# Save the forecast to CSV
forecast_df.to_csv('co2_emission_forecast_torch_2023_2025.csv', index=False)

print("Torch-based multi-dimensional forecast completed and saved to 'co2_emission_forecast_torch_2023_2025.csv'")
