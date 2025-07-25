"""
Data Generator Module for EV Manufacturing Inventory
===================================================

This module generates synthetic daily demand data for various EV components
using mathematical models that incorporate trends, seasonality, and random noise.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os


def generate_inventory_data(part_name, start_date='2021-01-01', years=3, 
                          base_demand=1000, trend_slope=50, 
                          seasonality_strength=200, noise_level=100, 
                          random_seed=42):
    """
    Generate synthetic daily demand data for EV manufacturing parts.
    
    This function creates realistic demand patterns by combining:
    - Linear trend growth
    - Seasonal variations (annual cycle)
    - Random noise for real-world variability
    
    Parameters:
    -----------
    part_name : str
        Name of the EV part (e.g., "Battery Pack", "Electric Motor")
    start_date : str
        Start date in 'YYYY-MM-DD' format
    years : int
        Number of years of data to generate
    base_demand : int
        Base daily demand level
    trend_slope : float
        Annual growth rate in units per year
    seasonality_strength : float
        Amplitude of seasonal variation
    noise_level : float
        Standard deviation of random noise
    random_seed : int
        Random seed for reproducible results
        
    Returns:
    --------
    pd.DataFrame
        DataFrame with columns: part_name, date, demand, lead_time
    """
    
    # Set random seed for reproducibility
    np.random.seed(random_seed)
    
    # Generate date range
    start = pd.to_datetime(start_date)
    end = start + timedelta(days=years * 365)
    dates = pd.date_range(start=start, end=end, freq='D')
    
    # Calculate time in years for trend calculation
    time_in_years = np.array([(date - start).days / 365.25 for date in dates])
    
    # Generate demand components
    # 1. Linear trend
    trend = trend_slope * time_in_years
    
    # 2. Seasonal pattern (annual cycle with some variation)
    seasonality = seasonality_strength * np.sin(2 * np.pi * time_in_years)
    
    # 3. Additional monthly variation
    monthly_variation = 50 * np.sin(2 * np.pi * time_in_years * 12)
    
    # 4. Random noise
    noise = np.random.normal(0, noise_level, len(dates))
    
    # 5. Weekend effect (slightly lower demand on weekends)
    weekend_effect = [-30 if date.weekday() >= 5 else 0 for date in dates]
    
    # Combine all components
    demand = base_demand + trend + seasonality + monthly_variation + noise + weekend_effect
    
    # Ensure demand is never negative
    demand = np.maximum(demand, 0)
    
    # Round to integers (parts are discrete units)
    demand = np.round(demand).astype(int)
    
    # Generate realistic lead times (varies by part complexity)
    lead_time_base = {
        'Battery Pack': 14,
        'Electric Motor': 10,
        'Charging Port': 7,
        'Control Unit': 12,
        'Cooling System': 8
    }
    
    base_lead_time = lead_time_base.get(part_name, 10)
    lead_times = np.random.normal(base_lead_time, 2, len(dates))
    lead_times = np.maximum(lead_times, 1)  # Minimum 1 day lead time
    lead_times = np.round(lead_times).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'part_name': part_name,
        'date': dates,
        'demand': demand,
        'lead_time': lead_times
    })
    
    return df


def generate_all_parts_data():
    """
    Generate synthetic data for all EV parts with realistic parameters.
    
    Returns:
    --------
    pd.DataFrame
        Combined DataFrame with data for all EV parts
    """
    
    # Define EV parts with their characteristics
    parts_config = [
        {
            "name": "Battery Pack",
            "base_demand": 500,
            "trend_slope": 25,
            "seasonality_strength": 150,
            "noise_level": 50
        },
        {
            "name": "Electric Motor", 
            "base_demand": 800,
            "trend_slope": 40,
            "seasonality_strength": 200,
            "noise_level": 80
        },
        {
            "name": "Charging Port",
            "base_demand": 1200,
            "trend_slope": 60,
            "seasonality_strength": 300,
            "noise_level": 120
        },
        {
            "name": "Control Unit",
            "base_demand": 600,
            "trend_slope": 30,
            "seasonality_strength": 180,
            "noise_level": 60
        },
        {
            "name": "Cooling System",
            "base_demand": 400,
            "trend_slope": 20,
            "seasonality_strength": 120,
            "noise_level": 40
        }
    ]
    
    all_data = []
    
    for part in parts_config:
        part_data = generate_inventory_data(
            part_name=part["name"],
            base_demand=part["base_demand"],
            trend_slope=part["trend_slope"],
            seasonality_strength=part["seasonality_strength"],
            noise_level=part["noise_level"]
        )
        all_data.append(part_data)
    
    # Combine all parts data
    combined_data = pd.concat(all_data, ignore_index=True)
    
    return combined_data


def save_data_to_csv(data, filename="synthetic_parts_demand.csv"):
    """
    Save generated data to CSV file.
    
    Parameters:
    -----------
    data : pd.DataFrame
        The data to save
    filename : str
        Name of the CSV file
    """
    
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    
    filepath = os.path.join("data", filename)
    data.to_csv(filepath, index=False)
    
    print(f"Data saved to {filepath}")
    return filepath


if __name__ == "__main__":
    # Generate and save sample data
    print("Generating synthetic EV parts demand data...")
    
    data = generate_all_parts_data()
    filepath = save_data_to_csv(data)
    
    print(f"Generated {len(data)} records for {data['part_name'].nunique()} parts")
    print(f"Date range: {data['date'].min()} to {data['date'].max()}")
    print(f"Data saved to: {filepath}")
