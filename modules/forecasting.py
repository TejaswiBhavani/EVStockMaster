"""
Forecasting Module for EV Manufacturing Inventory
================================================

This module provides time-series forecasting capabilities using Simple Moving Average (SMA)
and other statistical methods for predicting future demand of EV components.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
import warnings

warnings.filterwarnings('ignore')


def generate_forecast(data, part_name, window_size=30, forecast_horizon=30):
    """
    Generate demand forecast using Simple Moving Average (SMA) method.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data with columns: part_name, date, demand
    part_name : str
        Name of the EV part to forecast
    window_size : int
        Number of days to use for moving average calculation (7-90)
    forecast_horizon : int
        Number of days to forecast into the future (7-90)
        
    Returns:
    --------
    pd.DataFrame
        DataFrame with historical data, moving averages, and forecasts
    """
    
    # Filter data for the selected part
    part_data = data[data['part_name'] == part_name].copy()
    
    if part_data.empty:
        return pd.DataFrame()
    
    # Sort by date to ensure chronological order
    part_data = part_data.sort_values('date').reset_index(drop=True)
    
    # Ensure date column is datetime
    part_data['date'] = pd.to_datetime(part_data['date'])
    
    # Calculate Simple Moving Average
    part_data['sma'] = part_data['demand'].rolling(
        window=window_size, 
        min_periods=1
    ).mean()
    
    # Calculate additional technical indicators
    part_data['sma_short'] = part_data['demand'].rolling(
        window=max(7, window_size // 2), 
        min_periods=1
    ).mean()
    
    part_data['sma_long'] = part_data['demand'].rolling(
        window=min(90, window_size * 2), 
        min_periods=1
    ).mean()
    
    # Calculate standard deviation for confidence intervals
    part_data['rolling_std'] = part_data['demand'].rolling(
        window=window_size, 
        min_periods=1
    ).std()
    
    # Generate future dates for forecasting
    last_date = part_data['date'].max()
    future_dates = pd.date_range(
        start=last_date + timedelta(days=1),
        periods=forecast_horizon,
        freq='D'
    )
    
    # Get the last moving average value for projection
    last_sma = part_data['sma'].iloc[-1]
    last_std = part_data['rolling_std'].iloc[-1]
    
    # Calculate trend for more accurate forecasting
    if len(part_data) >= window_size:
        recent_data = part_data.tail(window_size)
        trend_slope, _, r_value, _, _ = stats.linregress(
            range(len(recent_data)), 
            recent_data['sma']
        )
    else:
        trend_slope = 0
        r_value = 0
    
    # Generate forecast values
    forecast_values = []
    for i in range(forecast_horizon):
        # Base forecast using last SMA with trend adjustment
        base_forecast = last_sma + (trend_slope * i)
        
        # Add some seasonal adjustment (simplified)
        seasonal_factor = 0.1 * np.sin(2 * np.pi * i / 365.25)
        
        forecast_value = base_forecast * (1 + seasonal_factor)
        
        # Ensure forecast is not negative
        forecast_value = max(forecast_value, 0)
        
        forecast_values.append(forecast_value)
    
    # Create forecast DataFrame
    forecast_df = pd.DataFrame({
        'part_name': part_name,
        'date': future_dates,
        'demand': np.nan,
        'sma': np.nan,
        'sma_short': np.nan,
        'sma_long': np.nan,
        'rolling_std': last_std,
        'forecast': forecast_values
    })
    
    # Add confidence intervals
    forecast_df['forecast_upper'] = forecast_df['forecast'] + (1.96 * last_std)
    forecast_df['forecast_lower'] = forecast_df['forecast'] - (1.96 * last_std)
    forecast_df['forecast_lower'] = forecast_df['forecast_lower'].clip(lower=0)
    
    # Combine historical and forecast data
    part_data['forecast'] = np.nan
    part_data['forecast_upper'] = np.nan
    part_data['forecast_lower'] = np.nan
    
    combined_df = pd.concat([part_data, forecast_df], ignore_index=True)
    
    # Add forecast quality metrics
    combined_df['trend_strength'] = abs(r_value) if r_value else 0
    combined_df['forecast_confidence'] = min(1.0, max(0.1, abs(r_value)))
    
    return combined_df


def calculate_forecast_accuracy(actual, predicted):
    """
    Calculate various forecast accuracy metrics.
    
    Parameters:
    -----------
    actual : array-like
        Actual observed values
    predicted : array-like
        Predicted/forecasted values
        
    Returns:
    --------
    dict
        Dictionary containing accuracy metrics
    """
    
    actual = np.array(actual)
    predicted = np.array(predicted)
    
    # Remove any NaN values
    mask = ~(np.isnan(actual) | np.isnan(predicted))
    actual = actual[mask]
    predicted = predicted[mask]
    
    if len(actual) == 0:
        return {}
    
    # Calculate metrics
    mae = np.mean(np.abs(actual - predicted))  # Mean Absolute Error
    mse = np.mean((actual - predicted) ** 2)   # Mean Squared Error
    rmse = np.sqrt(mse)                        # Root Mean Squared Error
    
    # Mean Absolute Percentage Error
    mape = np.mean(np.abs((actual - predicted) / np.maximum(actual, 1))) * 100
    
    # R-squared
    ss_res = np.sum((actual - predicted) ** 2)
    ss_tot = np.sum((actual - np.mean(actual)) ** 2)
    r_squared = 1 - (ss_res / max(ss_tot, 1))
    
    return {
        'MAE': mae,
        'MSE': mse,
        'RMSE': rmse,
        'MAPE': mape,
        'R_squared': r_squared
    }


def detect_seasonality(data, part_name):
    """
    Detect seasonal patterns in demand data.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data
    part_name : str
        Name of the EV part to analyze
        
    Returns:
    --------
    dict
        Dictionary containing seasonality information
    """
    
    part_data = data[data['part_name'] == part_name].copy()
    
    if len(part_data) < 30:
        return {'seasonal': False, 'pattern': 'insufficient_data'}
    
    part_data['date'] = pd.to_datetime(part_data['date'])
    part_data = part_data.sort_values('date')
    
    # Extract time components
    part_data['month'] = part_data['date'].dt.month
    part_data['weekday'] = part_data['date'].dt.weekday
    part_data['day_of_year'] = part_data['date'].dt.dayofyear
    
    # Test for monthly seasonality
    monthly_means = part_data.groupby('month')['demand'].mean()
    monthly_cv = monthly_means.std() / monthly_means.mean()
    
    # Test for weekly seasonality
    weekly_means = part_data.groupby('weekday')['demand'].mean()
    weekly_cv = weekly_means.std() / weekly_means.mean()
    
    # Determine seasonality
    is_seasonal = monthly_cv > 0.1 or weekly_cv > 0.05
    
    if monthly_cv > weekly_cv:
        pattern = 'monthly'
        strength = monthly_cv
    else:
        pattern = 'weekly'
        strength = weekly_cv
    
    return {
        'seasonal': is_seasonal,
        'pattern': pattern,
        'strength': strength,
        'monthly_cv': monthly_cv,
        'weekly_cv': weekly_cv
    }


def generate_advanced_forecast(data, part_name, method='sma', **kwargs):
    """
    Generate advanced forecasts using multiple methods.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data
    part_name : str
        Name of the EV part to forecast
    method : str
        Forecasting method ('sma', 'exponential', 'trend')
    **kwargs : dict
        Additional parameters for forecasting methods
        
    Returns:
    --------
    pd.DataFrame
        DataFrame with forecast results
    """
    
    if method == 'sma':
        return generate_forecast(data, part_name, **kwargs)
    
    # Placeholder for additional forecasting methods
    # Can be extended with exponential smoothing, ARIMA, etc.
    
    return generate_forecast(data, part_name, **kwargs)


if __name__ == "__main__":
    # Example usage
    from .data_generator import generate_all_parts_data
    
    # Generate sample data
    data = generate_all_parts_data()
    
    # Test forecasting for a specific part
    part_name = "Battery Pack"
    forecast_result = generate_forecast(data, part_name, window_size=30, forecast_horizon=30)
    
    print(f"Generated forecast for {part_name}")
    print(f"Historical data points: {forecast_result['demand'].notna().sum()}")
    print(f"Forecast data points: {forecast_result['forecast'].notna().sum()}")
    
    # Test seasonality detection
    seasonality = detect_seasonality(data, part_name)
    print(f"Seasonality analysis: {seasonality}")
