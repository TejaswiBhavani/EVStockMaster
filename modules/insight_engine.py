"""
Insight Engine Module for EV Manufacturing Inventory
===================================================

This module provides AI-powered insights and recommendations for inventory management
based on forecasted demand, current stock levels, and business rules.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings

warnings.filterwarnings('ignore')


def generate_insights(forecast_df, current_stock, reorder_threshold_days=14):
    """
    Generate AI-powered insights and recommendations for inventory management.
    
    Parameters:
    -----------
    forecast_df : pd.DataFrame
        DataFrame containing historical and forecasted demand data
    current_stock : int
        Current inventory level for the part
    reorder_threshold_days : int
        Number of days of stock to maintain before triggering reorder alert
        
    Returns:
    --------
    dict
        Dictionary containing status, recommendations, and detailed metrics
    """
    
    if forecast_df.empty:
        return {
            'status': 'Unknown',
            'recommendation': 'No data available for analysis',
            'details': 'Please check data availability and try again.',
            'metrics': {}
        }
    
    # Calculate key metrics from forecast data
    forecast_data = forecast_df.dropna(subset=['forecast'])
    
    if forecast_data.empty:
        # Use historical data if no forecast available
        historical_data = forecast_df.dropna(subset=['demand'])
        if historical_data.empty:
            return {
                'status': 'Unknown',
                'recommendation': 'Insufficient data for analysis',
                'details': 'No historical or forecast data available.',
                'metrics': {}
            }
        
        avg_daily_demand = historical_data['demand'].tail(30).mean()
        total_forecasted_demand = avg_daily_demand * reorder_threshold_days
    else:
        # Use forecast data for recommendations
        forecast_period = min(len(forecast_data), reorder_threshold_days)
        avg_daily_demand = forecast_data['forecast'].head(forecast_period).mean()
        total_forecasted_demand = forecast_data['forecast'].head(forecast_period).sum()
    
    # Calculate days of stock remaining
    days_of_stock = current_stock / max(avg_daily_demand, 1)
    
    # Safety stock calculation (typically 1.5x average demand for lead time)
    safety_stock = avg_daily_demand * reorder_threshold_days * 1.5
    
    # Determine stock status and generate recommendations
    status, recommendation, details = _determine_stock_status(
        current_stock=current_stock,
        total_forecasted_demand=total_forecasted_demand,
        avg_daily_demand=avg_daily_demand,
        days_of_stock=days_of_stock,
        reorder_threshold_days=reorder_threshold_days,
        safety_stock=safety_stock
    )
    
    # Calculate additional metrics
    metrics = {
        'current_stock': current_stock,
        'avg_daily_demand': round(avg_daily_demand, 2),
        'total_forecasted_demand': round(total_forecasted_demand, 2),
        'days_of_stock': round(days_of_stock, 1),
        'safety_stock': round(safety_stock, 2),
        'reorder_threshold_days': reorder_threshold_days,
        'recommended_order_quantity': max(0, round(safety_stock - current_stock, 0))
    }
    
    return {
        'status': status,
        'recommendation': recommendation,
        'details': details,
        'metrics': metrics
    }


def _determine_stock_status(current_stock, total_forecasted_demand, avg_daily_demand, 
                          days_of_stock, reorder_threshold_days, safety_stock):
    """
    Internal function to determine stock status based on business rules.
    
    Returns:
    --------
    tuple
        (status, recommendation, details)
    """
    
    # Critical status: Stock insufficient for forecast period
    if current_stock < total_forecasted_demand:
        shortage = total_forecasted_demand - current_stock
        
        status = "Critical"
        recommendation = f"URGENT: Order {int(shortage + safety_stock)} units immediately"
        details = (f"Current stock ({current_stock:,} units) is insufficient to meet "
                  f"forecasted demand ({total_forecasted_demand:,.0f} units) over the next "
                  f"{reorder_threshold_days} days. Risk of stockout in {days_of_stock:.1f} days.")
        
    # Warning status: Stock below safety levels
    elif current_stock < safety_stock:
        recommended_order = safety_stock - current_stock
        
        status = "Warning"
        recommendation = f"Reorder recommended: {int(recommended_order)} units"
        details = (f"Stock level ({current_stock:,} units) is below safety stock "
                  f"({safety_stock:,.0f} units). Consider reordering to maintain "
                  f"adequate buffer for demand variability.")
        
    # Healthy status: Stock levels adequate
    else:
        status = "Healthy"
        recommendation = "No immediate action required"
        details = (f"Stock level ({current_stock:,} units) is adequate for current "
                  f"demand patterns. Sufficient inventory for {days_of_stock:.1f} days "
                  f"at current consumption rate.")
    
    return status, recommendation, details


def generate_reorder_recommendations(data, part_configs):
    """
    Generate reorder recommendations for multiple parts.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data for all parts
    part_configs : dict
        Dictionary with part names as keys and config dictionaries as values
        Each config should contain: current_stock, reorder_threshold_days
        
    Returns:
    --------
    pd.DataFrame
        DataFrame with recommendations for all parts
    """
    
    from .forecasting import generate_forecast
    
    recommendations = []
    
    for part_name, config in part_configs.items():
        # Generate forecast for the part
        forecast_df = generate_forecast(
            data, 
            part_name, 
            window_size=config.get('window_size', 30),
            forecast_horizon=config.get('forecast_horizon', 30)
        )
        
        # Generate insights
        insights = generate_insights(
            forecast_df,
            config['current_stock'],
            config.get('reorder_threshold_days', 14)
        )
        
        # Compile recommendation
        recommendation = {
            'part_name': part_name,
            'current_stock': config['current_stock'],
            'status': insights['status'],
            'recommendation': insights['recommendation'],
            'days_of_stock': insights['metrics'].get('days_of_stock', 0),
            'recommended_order': insights['metrics'].get('recommended_order_quantity', 0),
            'priority': _get_priority_score(insights['status'])
        }
        
        recommendations.append(recommendation)
    
    # Convert to DataFrame and sort by priority
    recommendations_df = pd.DataFrame(recommendations)
    recommendations_df = recommendations_df.sort_values('priority', ascending=False)
    
    return recommendations_df


def _get_priority_score(status):
    """
    Get numerical priority score for status.
    
    Parameters:
    -----------
    status : str
        Status string ('Critical', 'Warning', 'Healthy')
        
    Returns:
    --------
    int
        Priority score (higher = more urgent)
    """
    
    priority_map = {
        'Critical': 3,
        'Warning': 2,
        'Healthy': 1,
        'Unknown': 0
    }
    
    return priority_map.get(status, 0)


def analyze_demand_volatility(data, part_name, window_size=30):
    """
    Analyze demand volatility for better inventory planning.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data
    part_name : str
        Name of the EV part to analyze
    window_size : int
        Window size for volatility calculation
        
    Returns:
    --------
    dict
        Dictionary containing volatility metrics
    """
    
    part_data = data[data['part_name'] == part_name].copy()
    
    if len(part_data) < window_size:
        return {'volatility': 'insufficient_data'}
    
    part_data = part_data.sort_values('date')
    
    # Calculate rolling volatility
    part_data['rolling_mean'] = part_data['demand'].rolling(window_size).mean()
    part_data['rolling_std'] = part_data['demand'].rolling(window_size).std()
    part_data['coefficient_of_variation'] = (
        part_data['rolling_std'] / part_data['rolling_mean']
    )
    
    # Calculate overall volatility metrics
    recent_cv = part_data['coefficient_of_variation'].tail(30).mean()
    overall_cv = part_data['demand'].std() / part_data['demand'].mean()
    
    # Classify volatility
    if recent_cv < 0.2:
        volatility_level = 'Low'
        safety_multiplier = 1.2
    elif recent_cv < 0.4:
        volatility_level = 'Medium'
        safety_multiplier = 1.5
    else:
        volatility_level = 'High'
        safety_multiplier = 2.0
    
    return {
        'volatility_level': volatility_level,
        'recent_cv': round(recent_cv, 3),
        'overall_cv': round(overall_cv, 3),
        'safety_multiplier': safety_multiplier,
        'recommended_safety_stock_days': round(14 * safety_multiplier, 0)
    }


def generate_supply_chain_insights(data, part_name, current_stock, lead_time_days=14):
    """
    Generate comprehensive supply chain insights.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data
    part_name : str
        Name of the EV part
    current_stock : int
        Current inventory level
    lead_time_days : int
        Supplier lead time in days
        
    Returns:
    --------
    dict
        Comprehensive supply chain analysis
    """
    
    from .forecasting import generate_forecast, detect_seasonality
    
    # Generate forecast
    forecast_df = generate_forecast(data, part_name, forecast_horizon=lead_time_days * 2)
    
    # Basic insights
    basic_insights = generate_insights(forecast_df, current_stock, lead_time_days)
    
    # Volatility analysis
    volatility = analyze_demand_volatility(data, part_name)
    
    # Seasonality analysis
    seasonality = detect_seasonality(data, part_name)
    
    # Lead time risk assessment
    lead_time_demand = forecast_df.dropna(subset=['forecast']).head(lead_time_days)['forecast'].sum()
    lead_time_risk = "High" if current_stock < lead_time_demand else "Low"
    
    return {
        'basic_insights': basic_insights,
        'volatility_analysis': volatility,
        'seasonality_analysis': seasonality,
        'lead_time_analysis': {
            'lead_time_days': lead_time_days,
            'lead_time_demand': round(lead_time_demand, 0),
            'lead_time_risk': lead_time_risk
        },
        'overall_risk_score': _calculate_overall_risk_score(
            basic_insights['status'], volatility.get('volatility_level', 'Medium'), lead_time_risk
        )
    }


def _calculate_overall_risk_score(status, volatility_level, lead_time_risk):
    """
    Calculate overall risk score for inventory management.
    
    Parameters:
    -----------
    status : str
        Current stock status
    volatility_level : str
        Demand volatility level
    lead_time_risk : str
        Lead time risk assessment
        
    Returns:
    --------
    str
        Overall risk level
    """
    
    risk_scores = {
        'status': {'Critical': 3, 'Warning': 2, 'Healthy': 1, 'Unknown': 1},
        'volatility': {'High': 3, 'Medium': 2, 'Low': 1},
        'lead_time': {'High': 3, 'Low': 1}
    }
    
    total_score = (
        risk_scores['status'].get(status, 1) +
        risk_scores['volatility'].get(volatility_level, 2) +
        risk_scores['lead_time'].get(lead_time_risk, 1)
    )
    
    if total_score >= 7:
        return 'High Risk'
    elif total_score >= 5:
        return 'Medium Risk'
    else:
        return 'Low Risk'


if __name__ == "__main__":
    # Example usage
    from .data_generator import generate_all_parts_data
    from .forecasting import generate_forecast
    
    # Generate sample data
    data = generate_all_parts_data()
    
    # Test insights for a specific part
    part_name = "Battery Pack"
    current_stock = 5000
    
    forecast_df = generate_forecast(data, part_name)
    insights = generate_insights(forecast_df, current_stock)
    
    print(f"Insights for {part_name}:")
    print(f"Status: {insights['status']}")
    print(f"Recommendation: {insights['recommendation']}")
    print(f"Details: {insights['details']}")
    print(f"Metrics: {insights['metrics']}")
