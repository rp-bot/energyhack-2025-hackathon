
# Eco-charge  
A Green-time to Charge! - [https://energyhack-2025-hackathon.vercel.app/](https://energyhack-2025-hackathon.vercel.app/)

## Introduction

Eco-charge is a project aimed at reducing CO2 emissions associated with EV charging by optimizing charging times through ‘Energy Mix’ prediction. While electric vehicles (EVs) are recognized as environmentally friendly alternatives to internal combustion engine (ICE) vehicles due to their lack of tailpipe emissions, the lifecycle emissions of EVs (including manufacturing, usage, and disposal) are often overlooked. A significant portion of EV use-phase emissions originates from charging, which remains heavily reliant on non-renewable sources in the USA.

R3charge addresses this issue by creating a tool that helps users understand and minimize the CO2 emissions associated with charging their EVs. By leveraging real-time data on the ‘Energy MIX‘ at a given location and predicting future energy mixes using machine learning, Eco-Charge provides the best times throughout the day to charge electric vehicles.

Most of the use-phase emissions associated with EVs come from recharging from the grid. In the USA, approximately 60% of grid electricity is generated from non-renewable, carbon-intensive sources. However, the MIX of energy sources (solar, wind, nuclear, natural gas, or coal) dynamically changes daily based on supply and demand. This means that during certain times of the day, such as when the share of renewables in the ‘MIX’ is high, electricity sent to homes is less carbon-intensive, and vice-versa.

Using a decade of data from the US Energy Information Administration (EIA), including electricity generation MIX and carbon emission statistics, Eco-Charge employs machine learning to forecast the carbon intensity of various energy sources in 2025. Coupled with real-time generation MIX data from the EIA, this tool recommends the time of day where charging an EV would result in the least upstream CO2e emissions and provides cost estimates. This approach enables EV users to make their use-phase as environmentally friendly as possible.

## Objectives

- Analyse the CO2 emissions associated with electricity generation in the U.S., depending on the location.
- Forecast future emissions trends for major energy sources like coal and natural gas.
- Provide ‘green’ charging time recommendations to the user for reducing EV charging-related emissions by optimizing charging times.
- Create a user-friendly website to display this data efficiently, detailing the best charging start times and durations based on user input.

## Data Collection

Data was sourced from the U.S. Energy Information Administration (EIA), which provides historical energy generation statistics by state and energy source. The dataset spans residential electricity generation from 2010 to 2020. This data includes the percentage contribution of various electricity generation sources (e.g., solar, wind, coal) for different locations throughout the USA. Additionally, it provides estimates of CO2 emissions caused per kWh usage of different sources such as coal, natural gas, and solar power.

Through this data, the real-time energy MIX for different locations can be tracked and retrieved. For example, on January 20, 2025, in Midtown, Atlanta, GA, the energy MIX could be 90% from coal burning and 10% from solar energy.

## Methodology

The data collected was used to calculate the total CO2 emissions associated with the energy MIX (through machine learning and predictions from current and past data) to determine the most eco-friendly time to charge an EV for a given location and time.

### Example Calculation

Let’s say that the energy MIX sent to Midtown, Atlanta, at 7 PM on January 20, 2025, is 90% coal and 10% solar energy. The CO2 emissions per kWh for coal are represented as \( a \), and for solar, as \( b \). If an EV has a battery capacity of 50 kWh and the charger provides 5 kW per hour, the battery will take 10 hours to fully recharge. <br/>

The total carbon emission (in metric tonnes) for 1 hour of charging with this energy MIX is calculated as:

![Alt text](https://imgur.com/pm2URTc.jpeg)


Using this approach, the total carbon emission for charging an EV (across 5 car models) is dynamically calculated based on the predicted energy MIX changes. The tool recommends the best charging times depending on the total charging hours required for a full battery capacity.

This data is visualized on a custom-made website where users can select their EV model and location to find the optimal ‘green’ time for recharging their vehicles.

## Future Work

With additional time and resources, Eco-Charge could be enhanced by:

1. Incorporating advanced AI techniques for more accurate forecasting.
2. Expanding coverage to include global energy systems beyond the U.S.
3. Integrating with smart home devices or EV apps (e.g., Tesla) to automate optimal charging schedules based on real-time grid conditions.
4. Scaling up the tool for commercial use by businesses aiming to reduce their carbon footprint.
5. Allowing users to compare suggested time ranges and select alternative time slots based on personal convenience.
