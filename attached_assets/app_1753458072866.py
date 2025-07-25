import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os

# Import custom modules
from modules.data_generator import generate_inventory_data
from modules.forecasting import generate_forecast
from modules.insight_engine import generate_insights
from modules.analytics import calculate_part_statistics, generate_leaderboard

# Configure Streamlit page
st.set_page_config(
    page_title="GenAI Smart Inventory Optimizer",
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'data_generated' not in st.session_state:
    st.session_state.data_generated = False
if 'inventory_data' not in st.session_state:
    st.session_state.inventory_data = None


def load_or_generate_data():
    """Load existing data or generate new synthetic data"""
    data_path = "data/synthetic_parts_demand.csv"
    
    if os.path.exists(data_path) and not st.session_state.data_generated:
        try:
            df = pd.read_csv(data_path)
            df['date'] = pd.to_datetime(df['date'])
            return df
        except:
            pass
    
    # Generate synthetic data for multiple EV parts
    parts = [
        {"name": "Battery Pack", "base_demand": 500, "trend_slope": 25, "seasonality_strength": 150},
        {"name": "Electric Motor", "base_demand": 800, "trend_slope": 40, "seasonality_strength": 200},
        {"name": "Charging Port", "base_demand": 1200, "trend_slope": 60, "seasonality_strength": 300},
        {"name": "Control Unit", "base_demand": 600, "trend_slope": 30, "seasonality_strength": 180},
        {"name": "Cooling System", "base_demand": 400, "trend_slope": 20, "seasonality_strength": 120}
    ]
    
    all_data = []
    for part in parts:
        part_data = generate_inventory_data(
            part_name=part["name"],
            base_demand=part["base_demand"],
            trend_slope=part["trend_slope"],
            seasonality_strength=part["seasonality_strength"]
        )
        all_data.append(part_data)
    
    combined_data = pd.concat(all_data, ignore_index=True)
    
    # Save data
    os.makedirs("data", exist_ok=True)
    combined_data.to_csv(data_path, index=False)
    
    return combined_data


def ai_chat_popup():
    """AI Assistant Chat Popup"""
    with st.container():
        st.markdown("---")
        col1, col2, col3 = st.columns([1, 2, 1])
        
        with col2:
            st.markdown("### 🤖 AI Assistant")
            
            # Close button
            if st.button("✕ Close", key="close_ai"):
                st.session_state.show_ai_chat = False
                st.rerun()
            
            # Initialize chat history
            if 'chat_history' not in st.session_state:
                st.session_state.chat_history = []
            
            # Chat interface
            with st.container():
                st.markdown("**Chat with your Inventory AI**")
                
                # Display chat history
                for message in st.session_state.chat_history:
                    if message["role"] == "user":
                        st.markdown(f"**You:** {message['content']}")
                    else:
                        st.markdown(f"**AI:** {message['content']}")
                
                # User input
                user_input = st.text_input("Ask about inventory management:", key="ai_input")
                
                if st.button("Send", key="send_msg") and user_input:
                    # Add user message
                    st.session_state.chat_history.append({"role": "user", "content": user_input})
                    
                    # Generate AI response (simple responses for inventory context)
                    if "forecast" in user_input.lower():
                        response = "I can help you understand forecasting trends. Check the 3D visualization charts to see demand patterns and seasonal variations for your EV parts."
                    elif "stock" in user_input.lower() or "inventory" in user_input.lower():
                        response = "Monitor your current stock levels using the dashboard. I recommend maintaining adequate safety stock based on lead times and demand variability."
                    elif "reorder" in user_input.lower():
                        response = "Set appropriate reorder points based on lead time and average demand. The system will alert you when stock levels approach critical thresholds."
                    elif "parts" in user_input.lower() or "component" in user_input.lower():
                        response = "You can analyze different EV components like Battery Packs, Electric Motors, Charging Ports, Control Units, and Cooling Systems using the sidebar controls."
                    else:
                        response = "I'm your EV inventory management assistant. I can help with forecasting, stock optimization, reorder planning, and parts analysis. What specific aspect would you like to explore?"
                    
                    # Add AI response
                    st.session_state.chat_history.append({"role": "assistant", "content": response})
                    st.rerun()





def main():
    # Header with AI Assistant
    col1, col2 = st.columns([6, 1])
    with col1:
        st.title("🚗 GenAI Smart Inventory Optimizer")
        st.markdown("### Intelligent EV Manufacturing Inventory Management")
    
    with col2:
        # AI Assistant Button
        if st.button("🤖", help="AI Assistant", key="ai_button"):
            st.session_state.show_ai_chat = True
    
    # AI Chat Popup
    if st.session_state.get('show_ai_chat', False):
        ai_chat_popup()
    
    # Load data
    with st.spinner("Loading inventory data..."):
        inventory_data = load_or_generate_data()
        st.session_state.inventory_data = inventory_data
    
    # Sidebar controls
    st.sidebar.header("📊 Control Panel")
    
    # Part selection
    available_parts = inventory_data['part_name'].unique()
    selected_part = st.sidebar.selectbox(
        "Select EV Part:",
        available_parts,
        help="Choose the EV component to analyze"
    )
    
    # Forecasting parameters
    st.sidebar.subheader("🔮 Forecasting Parameters")
    window_size = st.sidebar.slider(
        "Moving Average Window (days):",
        min_value=7,
        max_value=90,
        value=30,
        help="Number of days to use for moving average calculation"
    )
    
    forecast_horizon = st.sidebar.slider(
        "Forecast Horizon (days):",
        min_value=7,
        max_value=90,
        value=30,
        help="Number of days to forecast into the future"
    )
    
    # Inventory parameters
    st.sidebar.subheader("📦 Inventory Parameters")
    current_stock = st.sidebar.number_input(
        "Current Stock Level:",
        min_value=0,
        max_value=50000,
        value=5000,
        step=100,
        help="Current inventory level for the selected part"
    )
    
    reorder_threshold_days = st.sidebar.slider(
        "Reorder Lead Time (days):",
        min_value=1,
        max_value=30,
        value=14,
        help="Days of stock to maintain before reordering"
    )
    
    # Main content area
    tab1, tab2, tab3 = st.tabs(["📈 Dashboard", "🏆 Leaderboard", "📊 Analytics"])
    
    with tab1:
        # Generate forecast
        forecast_df = generate_forecast(
            inventory_data, 
            selected_part, 
            window_size, 
            forecast_horizon
        )
        
        # Generate insights
        insights = generate_insights(
            forecast_df, 
            current_stock, 
            reorder_threshold_days
        )
        
        # Display key metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            current_demand = forecast_df['demand'].iloc[-30:].mean() if not forecast_df.empty else 0
            st.metric(
                "Avg Daily Demand (30d)",
                f"{current_demand:.0f}",
                help="Average daily demand over the last 30 days"
            )
        
        with col2:
            forecast_demand = forecast_df['forecast'].dropna().mean() if 'forecast' in forecast_df.columns else 0
            st.metric(
                "Forecasted Demand",
                f"{forecast_demand:.0f}",
                help="Average forecasted daily demand"
            )
        
        with col3:
            days_of_stock = current_stock / max(current_demand, 1)
            st.metric(
                "Days of Stock",
                f"{days_of_stock:.1f}",
                help="Number of days current stock will last"
            )
        
        with col4:
            st.metric(
                "Current Stock",
                f"{current_stock:,}",
                help="Current inventory level"
            )
        
        # Display insights
        st.subheader("🤖 AI-Powered Insights")
        
        if insights['status'] == 'Critical':
            st.error(f"🚨 **{insights['status']}**: {insights['recommendation']}")
            st.error(insights['details'])
        elif insights['status'] == 'Warning':
            st.warning(f"⚠️ **{insights['status']}**: {insights['recommendation']}")
            st.warning(insights['details'])
        else:
            st.success(f"✅ **{insights['status']}**: {insights['recommendation']}")
            st.success(insights['details'])
        
        # Visualization
        st.subheader("📈 Demand Forecast Visualization")
        
        if not forecast_df.empty:
            fig = go.Figure()
            
            # Historical demand
            historical_data = forecast_df.dropna(subset=['demand'])
            fig.add_trace(go.Scatter(
                x=historical_data['date'],
                y=historical_data['demand'],
                mode='lines',
                name='Historical Demand',
                line=dict(color='#1f77b4', width=1),
                opacity=0.7
            ))
            
            # Moving average
            if 'sma' in forecast_df.columns:
                sma_data = forecast_df.dropna(subset=['sma'])
                fig.add_trace(go.Scatter(
                    x=sma_data['date'],
                    y=sma_data['sma'],
                    mode='lines',
                    name=f'{window_size}-Day Moving Average',
                    line=dict(color='#ff7f0e', width=2)
                ))
            
            # Forecast
            if 'forecast' in forecast_df.columns:
                forecast_data = forecast_df.dropna(subset=['forecast'])
                fig.add_trace(go.Scatter(
                    x=forecast_data['date'],
                    y=forecast_data['forecast'],
                    mode='lines',
                    name='Forecast',
                    line=dict(color='#2ca02c', width=2, dash='dash')
                ))
            
            # Update layout
            fig.update_layout(
                title=f"Demand Forecast for {selected_part}",
                xaxis_title="Date",
                yaxis_title="Demand (Units)",
                hovermode='x unified',
                showlegend=True,
                height=500,
                template="plotly_white"
            )
            
            st.plotly_chart(fig, use_container_width=True)
            
            # 3D Visualization Section
            st.subheader("📊 3D Demand Analysis")
            
            # Create tabs for different 3D views
            tab_3d1, tab_3d2, tab_3d3 = st.tabs(["🌊 3D Surface", "📈 3D Scatter", "🔀 Multi-Part 3D"])
            
            with tab_3d1:
                st.markdown("**3D Surface Plot**: Demand patterns over time with moving averages")
                
                # Prepare data for 3D surface plot
                if len(forecast_df) > 10:
                    # Create a mesh for surface plot
                    dates_numeric = pd.to_numeric(forecast_df['date'])
                    dates_normalized = (dates_numeric - dates_numeric.min()) / (dates_numeric.max() - dates_numeric.min()) * 100
                    
                    # Create surface data
                    x_surf = dates_normalized
                    y_surf = forecast_df['demand'].fillna(0)
                    z_surf = forecast_df['sma'].fillna(forecast_df['demand'].fillna(0))
                    
                    # Create 3D surface plot
                    fig_3d_surface = go.Figure(data=[
                        go.Scatter3d(
                            x=x_surf,
                            y=y_surf,
                            z=z_surf,
                            mode='markers+lines',
                            marker=dict(
                                size=4,
                                color=z_surf,
                                colorscale='Viridis',
                                showscale=True,
                                colorbar=dict(title="Moving Avg")
                            ),
                            line=dict(
                                color='rgba(70, 130, 180, 0.8)',
                                width=3
                            ),
                            name='Demand Surface',
                            hovertemplate='<b>Time Index</b>: %{x:.0f}<br><b>Demand</b>: %{y:.0f}<br><b>Moving Avg</b>: %{z:.0f}<extra></extra>'
                        )
                    ])
                    
                    fig_3d_surface.update_layout(
                        title=f'3D Demand Surface Analysis - {selected_part}',
                        scene=dict(
                            xaxis_title='Time Period',
                            yaxis_title='Daily Demand',
                            zaxis_title='Moving Average',
                            camera=dict(
                                eye=dict(x=1.5, y=1.5, z=1.5)
                            )
                        ),
                        height=600,
                        template="plotly_white"
                    )
                    
                    st.plotly_chart(fig_3d_surface, use_container_width=True)
                else:
                    st.info("Need more data points for 3D surface visualization")
            
            with tab_3d2:
                st.markdown("**3D Scatter Plot**: Historical vs Forecast vs Moving Average")
                
                # Prepare 3D scatter data
                historical_mask = forecast_df['demand'].notna()
                forecast_mask = forecast_df['forecast'].notna()
                
                fig_3d_scatter = go.Figure()
                
                # Historical points
                if historical_mask.any():
                    hist_data = forecast_df[historical_mask]
                    fig_3d_scatter.add_trace(go.Scatter3d(
                        x=pd.to_numeric(hist_data['date']),
                        y=hist_data['demand'],
                        z=hist_data['sma'].fillna(hist_data['demand']),
                        mode='markers',
                        marker=dict(
                            size=6,
                            color='blue',
                            opacity=0.8
                        ),
                        name='Historical Data',
                        hovertemplate='<b>Date</b>: %{text}<br><b>Demand</b>: %{y:.0f}<br><b>SMA</b>: %{z:.0f}<extra></extra>',
                        text=hist_data['date'].dt.strftime('%Y-%m-%d')
                    ))
                
                # Forecast points
                if forecast_mask.any():
                    forecast_data = forecast_df[forecast_mask]
                    fig_3d_scatter.add_trace(go.Scatter3d(
                        x=pd.to_numeric(forecast_data['date']),
                        y=forecast_data['forecast'],
                        z=forecast_data['sma'].fillna(forecast_data['forecast']),
                        mode='markers',
                        marker=dict(
                            size=8,
                            color='red',
                            opacity=0.9,
                            symbol='diamond'
                        ),
                        name='Forecast Data',
                        hovertemplate='<b>Date</b>: %{text}<br><b>Forecast</b>: %{y:.0f}<br><b>SMA</b>: %{z:.0f}<extra></extra>',
                        text=forecast_data['date'].dt.strftime('%Y-%m-%d')
                    ))
                
                fig_3d_scatter.update_layout(
                    title=f'3D Demand Scatter Analysis - {selected_part}',
                    scene=dict(
                        xaxis_title='Date (Numeric)',
                        yaxis_title='Demand/Forecast',
                        zaxis_title='Moving Average',
                        camera=dict(
                            eye=dict(x=1.2, y=1.2, z=1.2)
                        )
                    ),
                    height=600,
                    template="plotly_white"
                )
                
                st.plotly_chart(fig_3d_scatter, use_container_width=True)
            
            with tab_3d3:
                st.markdown("**Multi-Part 3D Comparison**: All EV parts demand patterns")
                
                # Create multi-part 3D visualization
                fig_3d_multi = go.Figure()
                
                colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
                
                for i, part in enumerate(available_parts[:5]):  # Limit to 5 parts for clarity
                    part_forecast = generate_forecast(inventory_data, part, window_size, 30)
                    
                    if not part_forecast.empty and len(part_forecast) > 5:
                        part_data = part_forecast.dropna(subset=['demand'])
                        if not part_data.empty:
                            dates_numeric = pd.to_numeric(part_data['date'])
                            dates_normalized = (dates_numeric - dates_numeric.min()) / (dates_numeric.max() - dates_numeric.min()) * 100
                            
                            fig_3d_multi.add_trace(go.Scatter3d(
                                x=dates_normalized,
                                y=part_data['demand'],
                                z=[i] * len(part_data),  # Use part index as Z coordinate
                                mode='markers+lines',
                                marker=dict(
                                    size=4,
                                    color=colors[i % len(colors)],
                                    opacity=0.8
                                ),
                                line=dict(
                                    color=colors[i % len(colors)],
                                    width=2
                                ),
                                name=part,
                                hovertemplate=f'<b>{part}</b><br><b>Time</b>: %{{x:.0f}}<br><b>Demand</b>: %{{y:.0f}}<extra></extra>'
                            ))
                
                fig_3d_multi.update_layout(
                    title='3D Multi-Part Demand Comparison',
                    scene=dict(
                        xaxis_title='Time Period',
                        yaxis_title='Demand',
                        zaxis_title='Part Index',
                        camera=dict(
                            eye=dict(x=1.5, y=1.5, z=1.5)
                        )
                    ),
                    height=600,
                    template="plotly_white"
                )
                
                st.plotly_chart(fig_3d_multi, use_container_width=True)
        else:
            st.warning("No data available for the selected part.")
    
    with tab2:
        st.subheader("🏆 EV Parts Performance Leaderboard")
        
        # Generate leaderboard
        leaderboard_df = generate_leaderboard(inventory_data)
        
        if not leaderboard_df.empty:
            # Display leaderboard
            for idx, row in leaderboard_df.iterrows():
                with st.container():
                    col1, col2, col3, col4, col5 = st.columns([1, 3, 2, 2, 2])
                    
                    with col1:
                        if idx == 0:
                            st.markdown("🥇")
                        elif idx == 1:
                            st.markdown("🥈")
                        elif idx == 2:
                            st.markdown("🥉")
                        else:
                            st.markdown(f"**{idx + 1}**")
                    
                    with col2:
                        st.markdown(f"**{row['part_name']}**")
                    
                    with col3:
                        st.metric("Avg Demand", f"{row['avg_demand']:.0f}")
                    
                    with col4:
                        st.metric("Trend", f"{row['trend_slope']:.1f}")
                    
                    with col5:
                        st.metric("Volatility", f"{row['volatility']:.0f}")
                    
                    st.divider()
        else:
            st.warning("No data available for leaderboard.")
    
    with tab3:
        st.subheader("📊 Detailed Analytics")
        
        # Part selection for analytics
        analytics_part = st.selectbox(
            "Select Part for Detailed Analysis:",
            available_parts,
            key="analytics_part"
        )
        
        # Calculate statistics
        stats = calculate_part_statistics(inventory_data, analytics_part)
        
        if stats:
            # Display statistics
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("📈 Demand Statistics")
                st.metric("Mean Daily Demand", f"{stats['mean_demand']:.1f}")
                st.metric("Median Daily Demand", f"{stats['median_demand']:.1f}")
                st.metric("Standard Deviation", f"{stats['std_demand']:.1f}")
                st.metric("Minimum Demand", f"{stats['min_demand']:.1f}")
                st.metric("Maximum Demand", f"{stats['max_demand']:.1f}")
            
            with col2:
                st.subheader("📊 Trend Analysis")
                st.metric("Trend Slope", f"{stats['trend_slope']:.2f}")
                st.metric("Total Demand", f"{stats['total_demand']:,.0f}")
                st.metric("Demand Range", f"{stats['demand_range']:.1f}")
                
                # Demand distribution chart
                part_data = inventory_data[inventory_data['part_name'] == analytics_part]
                if not part_data.empty:
                    fig_hist = px.histogram(
                        part_data, 
                        x='demand', 
                        nbins=50,
                        title=f"Demand Distribution - {analytics_part}",
                        template="plotly_white"
                    )
                    fig_hist.update_layout(height=300)
                    st.plotly_chart(fig_hist, use_container_width=True)
        else:
            st.warning("No statistics available for the selected part.")
    


if __name__ == "__main__":
    main()
