# GenAI Smart Inventory Optimizer for EV Manufacturing

## Overview

This is a Streamlit-based smart inventory optimization system designed specifically for Electric Vehicle (EV) manufacturing. The application uses synthetic data generation, time-series forecasting, and AI-powered insights to help manufacturers optimize their inventory levels for various EV components like battery packs, electric motors, charging ports, control units, and cooling systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Streamlit web application with wide layout configuration
- **User Interface**: Interactive dashboard with expandable sidebar navigation
- **Visualization**: Plotly Express and Plotly Graph Objects for dynamic, interactive charts
- **State Management**: Streamlit session state for maintaining data persistence across user interactions
- **Responsive Design**: Wide layout optimized for desktop viewing with mobile compatibility

### Backend Architecture
- **Modular Design**: Python modules organized by specific functionality (data generation, forecasting, analytics, insights)
- **Data Processing**: Pandas DataFrames for efficient data manipulation and analysis
- **Statistical Computing**: NumPy and SciPy for mathematical computations and statistical analysis
- **Time-Series Processing**: Custom algorithms for demand forecasting and trend analysis

### Data Storage Solutions
- **File-Based Storage**: CSV files stored locally in `/data` directory for persistent data storage
- **In-Memory Processing**: Pandas DataFrames for real-time data manipulation and analysis
- **Session Persistence**: Streamlit session state for maintaining user data during application sessions
- **Synthetic Data Generation**: Programmatic generation of realistic EV parts demand data

## Key Components

### 1. Data Generator Module (`modules/data_generator.py`)
- **Purpose**: Creates synthetic daily demand data for various EV manufacturing components
- **Algorithm**: Combines linear trend growth, seasonal variations, and random noise to simulate realistic demand patterns
- **Components Covered**: Battery Pack, Electric Motor, Charging Port, Control Unit, Cooling System
- **Output**: Time-series data with configurable parameters for base demand, growth trends, and seasonality

### 2. Forecasting Engine (`modules/forecasting.py`)
- **Method**: Simple Moving Average (SMA) forecasting algorithm
- **Functionality**: Predicts future demand based on historical patterns
- **Configurability**: Adjustable window sizes (7-90 days) and forecast horizons (7-90 days)
- **Output**: Future demand predictions with trend analysis and confidence indicators

### 3. Insight Engine (`modules/insight_engine.py`)
- **Function**: Rule-based AI system for generating inventory management recommendations
- **Analysis**: Compares current stock levels against forecasted demand
- **Alerts**: Generates reorder alerts, overstock warnings, and optimization suggestions
- **Business Logic**: Incorporates reorder thresholds and lead time considerations

### 4. Analytics Module (`modules/analytics.py`)
- **Statistical Analysis**: Comprehensive metrics calculation including mean, median, standard deviation, and trend analysis
- **Performance Tracking**: Part-specific statistics and performance indicators
- **Comparative Analysis**: Leaderboard functionality for comparing performance across different EV components
- **Advanced Metrics**: Volatility analysis, growth rates, and seasonal pattern detection

## Data Flow

1. **Data Generation/Loading**: System either loads existing CSV data or generates new synthetic data for EV parts
2. **Data Processing**: Raw demand data is processed and cleaned using pandas operations
3. **Forecasting**: Historical data is fed into the SMA forecasting algorithm to predict future demand
4. **Insight Generation**: Current stock levels and forecasts are analyzed to generate actionable recommendations
5. **Visualization**: Processed data and insights are rendered through interactive Plotly charts
6. **User Interaction**: Users can adjust parameters and view different time horizons through the Streamlit interface

## External Dependencies

### Core Libraries
- **Streamlit**: Web application framework for the user interface
- **Pandas**: Data manipulation and analysis library
- **NumPy**: Numerical computing library for mathematical operations
- **Plotly**: Interactive visualization library for charts and graphs
- **SciPy**: Scientific computing library for statistical analysis

### Development Dependencies
- **Python 3.7+**: Core runtime environment
- **Standard Library**: datetime, os, warnings modules for basic functionality

## Deployment Strategy

### Local Development
- **Setup**: Standard Python environment with pip package installation
- **Data Storage**: Local file system using CSV files in `/data` directory
- **Session Management**: Streamlit's built-in session state handling
- **Port Configuration**: Default Streamlit port (8501) for local access

### Production Considerations
- **Scalability**: Single-user application suitable for small to medium deployments
- **Data Persistence**: File-based storage suitable for prototyping, may need database upgrade for production
- **Security**: Basic Streamlit security, may require additional authentication for enterprise use
- **Performance**: In-memory processing suitable for moderate data volumes

### Future Architecture Considerations
- **Database Integration**: Potential migration from CSV to PostgreSQL for better data management
- **Authentication**: User management system for multi-user access
- **API Layer**: REST API development for integration with other manufacturing systems
- **Real-time Data**: Integration with live manufacturing data feeds instead of synthetic data