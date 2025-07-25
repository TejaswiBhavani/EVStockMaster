"""
Analytics Module for EV Manufacturing Inventory
==============================================

This module provides comprehensive statistical analysis, performance metrics,
and comparative analytics for EV parts inventory management.
"""

import pandas as pd
import numpy as np
from scipy import stats
from datetime import datetime, timedelta
import warnings

warnings.filterwarnings('ignore')


def calculate_part_statistics(data, part_name):
    """
    Calculate comprehensive statistics for a specific EV part.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data with columns: part_name, date, demand
    part_name : str
        Name of the EV part to analyze
        
    Returns:
    --------
    dict
        Dictionary containing detailed statistical analysis
    """
    
    # Filter data for the specific part
    part_data = data[data['part_name'] == part_name].copy()
    
    if part_data.empty:
        return {'error': 'No data available for the specified part'}
    
    # Ensure date column is datetime and sort
    part_data['date'] = pd.to_datetime(part_data['date'])
    part_data = part_data.sort_values('date').reset_index(drop=True)
    
    demand = part_data['demand']
    
    # Basic descriptive statistics
    basic_stats = {
        'count': len(demand),
        'mean': demand.mean(),
        'median': demand.median(),
        'std': demand.std(),
        'min': demand.min(),
        'max': demand.max(),
        'range': demand.max() - demand.min(),
        'q25': demand.quantile(0.25),
        'q75': demand.quantile(0.75),
        'iqr': demand.quantile(0.75) - demand.quantile(0.25)
    }
    
    # Coefficient of variation (measure of relative variability)
    basic_stats['cv'] = basic_stats['std'] / basic_stats['mean'] if basic_stats['mean'] > 0 else 0
    
    # Trend analysis using linear regression
    if len(part_data) > 1:
        x = np.arange(len(part_data))
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, demand)
        
        trend_stats = {
            'slope': slope,
            'intercept': intercept,
            'r_squared': r_value ** 2,
            'p_value': p_value,
            'trend_direction': 'increasing' if slope > 0 else 'decreasing' if slope < 0 else 'stable',
            'annual_growth_rate': slope * 365 / basic_stats['mean'] * 100 if basic_stats['mean'] > 0 else 0
        }
    else:
        trend_stats = {'error': 'Insufficient data for trend analysis'}
    
    # Seasonality analysis
    seasonality_stats = _analyze_seasonality(part_data)
    
    # Volatility analysis
    volatility_stats = _analyze_volatility(part_data)
    
    # Quality metrics
    quality_stats = _analyze_data_quality(part_data)
    
    # Recent performance (last 30 days)
    recent_data = part_data.tail(30) if len(part_data) >= 30 else part_data
    recent_stats = {
        'recent_mean': recent_data['demand'].mean(),
        'recent_std': recent_data['demand'].std(),
        'recent_trend': 'improving' if len(recent_data) > 1 and np.polyfit(range(len(recent_data)), recent_data['demand'], 1)[0] > 0 else 'declining'
    }
    
    return {
        'part_name': part_name,
        'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'data_period': {
            'start_date': part_data['date'].min().strftime('%Y-%m-%d'),
            'end_date': part_data['date'].max().strftime('%Y-%m-%d'),
            'total_days': (part_data['date'].max() - part_data['date'].min()).days + 1
        },
        'basic_statistics': basic_stats,
        'trend_analysis': trend_stats,
        'seasonality_analysis': seasonality_stats,
        'volatility_analysis': volatility_stats,
        'data_quality': quality_stats,
        'recent_performance': recent_stats
    }


def _analyze_seasonality(part_data):
    """
    Analyze seasonal patterns in demand data.
    
    Parameters:
    -----------
    part_data : pd.DataFrame
        Part-specific demand data with date and demand columns
        
    Returns:
    --------
    dict
        Seasonality analysis results
    """
    
    if len(part_data) < 30:
        return {'error': 'Insufficient data for seasonality analysis'}
    
    part_data = part_data.copy()
    part_data['month'] = part_data['date'].dt.month
    part_data['weekday'] = part_data['date'].dt.weekday
    part_data['quarter'] = part_data['date'].dt.quarter
    
    # Monthly analysis
    monthly_stats = part_data.groupby('month')['demand'].agg(['mean', 'std', 'count'])
    monthly_cv = monthly_stats['std'] / monthly_stats['mean']
    
    # Weekly analysis
    weekly_stats = part_data.groupby('weekday')['demand'].agg(['mean', 'std', 'count'])
    weekly_cv = weekly_stats['std'] / weekly_stats['mean']
    
    # Quarterly analysis
    quarterly_stats = part_data.groupby('quarter')['demand'].agg(['mean', 'std', 'count'])
    
    # Peak detection
    peak_month = monthly_stats['mean'].idxmax()
    low_month = monthly_stats['mean'].idxmin()
    peak_weekday = weekly_stats['mean'].idxmax()
    low_weekday = weekly_stats['mean'].idxmin()
    
    return {
        'monthly_seasonality': {
            'coefficient_of_variation': monthly_cv.mean(),
            'peak_month': peak_month,
            'low_month': low_month,
            'seasonal_amplitude': (monthly_stats['mean'].max() - monthly_stats['mean'].min()) / monthly_stats['mean'].mean()
        },
        'weekly_seasonality': {
            'coefficient_of_variation': weekly_cv.mean(),
            'peak_weekday': peak_weekday,
            'low_weekday': low_weekday,
            'weekly_amplitude': (weekly_stats['mean'].max() - weekly_stats['mean'].min()) / weekly_stats['mean'].mean()
        },
        'quarterly_patterns': {
            'q1_avg': quarterly_stats.loc[1, 'mean'] if 1 in quarterly_stats.index else None,
            'q2_avg': quarterly_stats.loc[2, 'mean'] if 2 in quarterly_stats.index else None,
            'q3_avg': quarterly_stats.loc[3, 'mean'] if 3 in quarterly_stats.index else None,
            'q4_avg': quarterly_stats.loc[4, 'mean'] if 4 in quarterly_stats.index else None
        }
    }


def _analyze_volatility(part_data):
    """
    Analyze demand volatility patterns.
    
    Parameters:
    -----------
    part_data : pd.DataFrame
        Part-specific demand data
        
    Returns:
    --------
    dict
        Volatility analysis results
    """
    
    demand = part_data['demand']
    
    # Rolling volatility analysis
    windows = [7, 14, 30]
    rolling_volatility = {}
    
    for window in windows:
        if len(demand) >= window:
            rolling_std = demand.rolling(window).std()
            rolling_mean = demand.rolling(window).mean()
            rolling_cv = rolling_std / rolling_mean
            
            rolling_volatility[f'{window}_day'] = {
                'avg_cv': rolling_cv.mean(),
                'max_cv': rolling_cv.max(),
                'min_cv': rolling_cv.min(),
                'current_cv': rolling_cv.iloc[-1] if not rolling_cv.empty else None
            }
    
    # Daily change analysis
    if len(demand) > 1:
        daily_changes = demand.diff().dropna()
        daily_change_stats = {
            'avg_daily_change': daily_changes.mean(),
            'std_daily_change': daily_changes.std(),
            'max_daily_increase': daily_changes.max(),
            'max_daily_decrease': daily_changes.min(),
            'volatility_score': abs(daily_changes.std() / demand.mean()) if demand.mean() > 0 else 0
        }
    else:
        daily_change_stats = {'error': 'Insufficient data for daily change analysis'}
    
    # Volatility classification
    overall_cv = demand.std() / demand.mean() if demand.mean() > 0 else 0
    
    if overall_cv < 0.2:
        volatility_level = 'Low'
    elif overall_cv < 0.5:
        volatility_level = 'Medium'
    else:
        volatility_level = 'High'
    
    return {
        'overall_coefficient_of_variation': overall_cv,
        'volatility_level': volatility_level,
        'rolling_volatility': rolling_volatility,
        'daily_change_analysis': daily_change_stats
    }


def _analyze_data_quality(part_data):
    """
    Analyze data quality metrics.
    
    Parameters:
    -----------
    part_data : pd.DataFrame
        Part-specific demand data
        
    Returns:
    --------
    dict
        Data quality analysis results
    """
    
    demand = part_data['demand']
    
    # Completeness
    total_records = len(part_data)
    non_null_records = demand.notna().sum()
    completeness_rate = non_null_records / total_records if total_records > 0 else 0
    
    # Outlier detection using IQR method
    q25 = demand.quantile(0.25)
    q75 = demand.quantile(0.75)
    iqr = q75 - q25
    lower_bound = q25 - 1.5 * iqr
    upper_bound = q75 + 1.5 * iqr
    
    outliers = demand[(demand < lower_bound) | (demand > upper_bound)]
    outlier_rate = len(outliers) / len(demand) if len(demand) > 0 else 0
    
    # Zero demand days
    zero_demand_days = (demand == 0).sum()
    zero_demand_rate = zero_demand_days / len(demand) if len(demand) > 0 else 0
    
    # Data consistency (check for reasonable values)
    negative_values = (demand < 0).sum()
    extremely_high_values = (demand > demand.quantile(0.99) * 3).sum()
    
    # Overall quality score
    quality_score = (
        completeness_rate * 0.4 +
        (1 - outlier_rate) * 0.3 +
        (1 - zero_demand_rate) * 0.2 +
        (1 - negative_values / len(demand)) * 0.1 if len(demand) > 0 else 0
    )
    
    return {
        'completeness_rate': completeness_rate,
        'outlier_rate': outlier_rate,
        'zero_demand_rate': zero_demand_rate,
        'negative_values': negative_values,
        'extremely_high_values': extremely_high_values,
        'quality_score': quality_score,
        'quality_grade': 'Excellent' if quality_score >= 0.9 else 'Good' if quality_score >= 0.7 else 'Fair' if quality_score >= 0.5 else 'Poor'
    }


def generate_leaderboard(data, sort_by='avg_demand'):
    """
    Generate performance leaderboard for all EV parts.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Complete demand data for all parts
    sort_by : str
        Metric to sort by ('avg_demand', 'growth_rate', 'volatility', 'quality_score')
        
    Returns:
    --------
    pd.DataFrame
        Leaderboard with rankings and performance metrics
    """
    
    parts = data['part_name'].unique()
    leaderboard_data = []
    
    for part in parts:
        stats = calculate_part_statistics(data, part)
        
        if 'error' not in stats:
            basic_stats = stats['basic_statistics']
            trend_stats = stats.get('trend_analysis', {})
            volatility_stats = stats.get('volatility_analysis', {})
            quality_stats = stats.get('data_quality', {})
            
            leaderboard_entry = {
                'part_name': part,
                'avg_demand': round(basic_stats['mean'], 1),
                'growth_rate': round(trend_stats.get('annual_growth_rate', 0), 2),
                'volatility': round(volatility_stats.get('overall_coefficient_of_variation', 0), 3),
                'quality_score': round(quality_stats.get('quality_score', 0), 3),
                'trend_strength': round(trend_stats.get('r_squared', 0), 3),
                'data_points': basic_stats['count']
            }
            
            leaderboard_data.append(leaderboard_entry)
    
    # Create DataFrame
    leaderboard_df = pd.DataFrame(leaderboard_data)
    
    if leaderboard_df.empty:
        return leaderboard_df
    
    # Sort by specified metric
    ascending = sort_by in ['volatility']  # Lower volatility is better
    leaderboard_df = leaderboard_df.sort_values(sort_by, ascending=ascending)
    
    # Add rankings
    leaderboard_df['rank'] = range(1, len(leaderboard_df) + 1)
    
    # Add medal indicators
    leaderboard_df['medal'] = ''
    if len(leaderboard_df) >= 1:
        leaderboard_df.iloc[0, leaderboard_df.columns.get_loc('medal')] = '🥇'
    if len(leaderboard_df) >= 2:
        leaderboard_df.iloc[1, leaderboard_df.columns.get_loc('medal')] = '🥈'
    if len(leaderboard_df) >= 3:
        leaderboard_df.iloc[2, leaderboard_df.columns.get_loc('medal')] = '🥉'
    
    # Reorder columns
    column_order = ['rank', 'medal', 'part_name', 'avg_demand', 'growth_rate', 
                   'volatility', 'quality_score', 'trend_strength', 'data_points']
    leaderboard_df = leaderboard_df[column_order]
    
    return leaderboard_df


def calculate_inventory_efficiency_metrics(data, part_configs):
    """
    Calculate inventory efficiency metrics for multiple parts.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data
    part_configs : dict
        Dictionary with part configurations including current stock levels
        
    Returns:
    --------
    pd.DataFrame
        DataFrame with efficiency metrics for each part
    """
    
    efficiency_data = []
    
    for part_name, config in part_configs.items():
        part_data = data[data['part_name'] == part_name]
        
        if part_data.empty:
            continue
            
        current_stock = config.get('current_stock', 0)
        avg_demand = part_data['demand'].mean()
        
        # Calculate efficiency metrics
        inventory_turnover = (avg_demand * 365) / max(current_stock, 1)
        days_of_inventory = current_stock / max(avg_demand, 1)
        
        # Service level estimation (assuming stockouts when demand exceeds daily average)
        high_demand_days = (part_data['demand'] > avg_demand * 1.5).sum()
        service_level = 1 - (high_demand_days / len(part_data))
        
        efficiency_entry = {
            'part_name': part_name,
            'current_stock': current_stock,
            'avg_daily_demand': round(avg_demand, 1),
            'inventory_turnover': round(inventory_turnover, 2),
            'days_of_inventory': round(days_of_inventory, 1),
            'estimated_service_level': round(service_level, 3),
            'efficiency_score': round((inventory_turnover * service_level) / max(days_of_inventory, 1), 3)
        }
        
        efficiency_data.append(efficiency_entry)
    
    return pd.DataFrame(efficiency_data)


def generate_comparative_analysis(data, part_name_1, part_name_2):
    """
    Generate comparative analysis between two EV parts.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Historical demand data
    part_name_1, part_name_2 : str
        Names of the parts to compare
        
    Returns:
    --------
    dict
        Comparative analysis results
    """
    
    stats_1 = calculate_part_statistics(data, part_name_1)
    stats_2 = calculate_part_statistics(data, part_name_2)
    
    if 'error' in stats_1 or 'error' in stats_2:
        return {'error': 'Unable to generate comparison due to insufficient data'}
    
    # Compare key metrics
    comparison = {
        'parts_compared': [part_name_1, part_name_2],
        'demand_comparison': {
            'higher_avg_demand': part_name_1 if stats_1['basic_statistics']['mean'] > stats_2['basic_statistics']['mean'] else part_name_2,
            'demand_difference': abs(stats_1['basic_statistics']['mean'] - stats_2['basic_statistics']['mean']),
            'demand_ratio': stats_1['basic_statistics']['mean'] / max(stats_2['basic_statistics']['mean'], 1)
        },
        'growth_comparison': {
            'faster_growing': part_name_1 if stats_1['trend_analysis'].get('annual_growth_rate', 0) > stats_2['trend_analysis'].get('annual_growth_rate', 0) else part_name_2,
            'growth_difference': abs(stats_1['trend_analysis'].get('annual_growth_rate', 0) - stats_2['trend_analysis'].get('annual_growth_rate', 0))
        },
        'volatility_comparison': {
            'more_stable': part_name_1 if stats_1['volatility_analysis']['overall_coefficient_of_variation'] < stats_2['volatility_analysis']['overall_coefficient_of_variation'] else part_name_2,
            'volatility_difference': abs(stats_1['volatility_analysis']['overall_coefficient_of_variation'] - stats_2['volatility_analysis']['overall_coefficient_of_variation'])
        }
    }
    
    return comparison


if __name__ == "__main__":
    # Example usage
    from .data_generator import generate_all_parts_data
    
    # Generate sample data
    data = generate_all_parts_data()
    
    # Test statistics calculation
    part_name = "Battery Pack"
    stats = calculate_part_statistics(data, part_name)
    
    print(f"Statistics for {part_name}:")
    print(f"Average demand: {stats['basic_statistics']['mean']:.1f}")
    print(f"Growth rate: {stats['trend_analysis']['annual_growth_rate']:.2f}%")
    print(f"Volatility: {stats['volatility_analysis']['volatility_level']}")
    
    # Test leaderboard generation
    leaderboard = generate_leaderboard(data)
    print(f"\nLeaderboard:")
    print(leaderboard[['rank', 'medal', 'part_name', 'avg_demand', 'growth_rate']].to_string(index=False))
