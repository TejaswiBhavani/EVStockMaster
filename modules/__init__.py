"""
GenAI Smart Inventory Optimizer Modules
======================================

This package contains the core business logic modules for the EV manufacturing
inventory optimization system.

Modules:
- data_generator: Synthetic data generation for EV parts
- forecasting: Time-series forecasting algorithms
- insight_engine: AI-powered recommendation system
- analytics: Statistical analysis and performance metrics
"""

__version__ = "1.0.0"
__author__ = "GenAI Smart Inventory Team"

# Import main functions for easy access
from .data_generator import generate_inventory_data
from .forecasting import generate_forecast
from .insight_engine import generate_insights
from .analytics import calculate_part_statistics, generate_leaderboard

__all__ = [
    'generate_inventory_data',
    'generate_forecast', 
    'generate_insights',
    'calculate_part_statistics',
    'generate_leaderboard'
]
