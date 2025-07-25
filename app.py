import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os
import hashlib

# Import custom modules
from modules.data_generator import generate_inventory_data, generate_all_parts_data
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
if 'show_ai_chat' not in st.session_state:
    st.session_state.show_ai_chat = False
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'user_logged_in' not in st.session_state:
    st.session_state.user_logged_in = False
if 'current_user' not in st.session_state:
    st.session_state.current_user = None
if 'show_login' not in st.session_state:
    st.session_state.show_login = False
if 'show_signup' not in st.session_state:
    st.session_state.show_signup = False
if 'show_settings' not in st.session_state:
    st.session_state.show_settings = False
if 'users_db' not in st.session_state:
    st.session_state.users_db = {}
if 'user_settings' not in st.session_state:
    st.session_state.user_settings = {
        'theme': 'Light',
        'notifications': True,
        'auto_refresh': True,
        'chart_type': 'Standard',
        'language': 'English'
    }


def create_innovative_logo():
    """Create an innovative SVG logo for the application"""
    logo_svg = """
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#0066ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#6600ff;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffca28;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Outer circle -->
        <circle cx="30" cy="30" r="28" fill="url(#grad1)" stroke="#ffffff" stroke-width="2"/>
        
        <!-- Electric bolt -->
        <path d="M20 15 L35 15 L28 30 L40 30 L25 45 L32 30 L20 30 Z" fill="url(#grad2)" stroke="#ffffff" stroke-width="1"/>
        
        <!-- Circuit pattern -->
        <circle cx="18" cy="18" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="42" cy="18" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="18" cy="42" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="42" cy="42" r="2" fill="#ffffff" opacity="0.8"/>
        
        <!-- Connecting lines -->
        <line x1="18" y1="18" x2="25" y2="25" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
        <line x1="42" y1="18" x2="35" y2="25" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
        <line x1="18" y1="42" x2="25" y2="35" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
        <line x1="42" y1="42" x2="35" y2="35" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
    </svg>
    """
    return logo_svg


def hash_password(password):
    """Hash password for secure storage"""
    return hashlib.sha256(password.encode()).hexdigest()


def authenticate_user(username, password):
    """Authenticate user credentials"""
    if username in st.session_state.users_db:
        stored_hash = st.session_state.users_db[username]['password']
        return stored_hash == hash_password(password)
    return False


def register_user(username, email, password):
    """Register a new user"""
    if username in st.session_state.users_db:
        return False, "Username already exists"
    
    st.session_state.users_db[username] = {
        'email': email,
        'password': hash_password(password),
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    return True, "User registered successfully"


def render_login_modal():
    """Render login modal"""
    with st.container():
        st.markdown("""
        <style>
        .login-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .login-box {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            width: 400px;
            max-width: 90%;
        }
        .login-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .login-title {
            color: #1f77b4;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        </style>
        <div class="login-modal">
            <div class="login-box">
                <button class="close-btn" onclick="window.parent.postMessage({type: 'close_login'}, '*')">×</button>
                <div class="login-header">
                    <div class="login-title">Welcome Back</div>
                    <p style="color: #666; margin: 0;">Sign in to your account</p>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.markdown("### 🔐 Login")
            
            if st.button("× Close", key="close_login_btn"):
                st.session_state.show_login = False
                st.rerun()
            
            with st.form("login_form"):
                username = st.text_input("Username", placeholder="Enter your username")
                password = st.text_input("Password", type="password", placeholder="Enter your password")
                
                col_login, col_signup = st.columns(2)
                with col_login:
                    login_btn = st.form_submit_button("Login", use_container_width=True)
                with col_signup:
                    if st.form_submit_button("Need Account?", use_container_width=True):
                        st.session_state.show_login = False
                        st.session_state.show_signup = True
                        st.rerun()
                
                if login_btn and username and password:
                    if authenticate_user(username, password):
                        st.session_state.user_logged_in = True
                        st.session_state.current_user = username
                        st.session_state.show_login = False
                        st.success("Login successful!")
                        st.rerun()
                    else:
                        st.error("Invalid username or password")


def render_signup_modal():
    """Render signup modal"""
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("### 👤 Create Account")
        
        if st.button("× Close", key="close_signup_btn"):
            st.session_state.show_signup = False
            st.rerun()
        
        with st.form("signup_form"):
            username = st.text_input("Username", placeholder="Choose a username")
            email = st.text_input("Email", placeholder="Enter your email")
            password = st.text_input("Password", type="password", placeholder="Create a password")
            confirm_password = st.text_input("Confirm Password", type="password", placeholder="Confirm your password")
            
            col_signup, col_login = st.columns(2)
            with col_signup:
                signup_btn = st.form_submit_button("Sign Up", use_container_width=True)
            with col_login:
                if st.form_submit_button("Have Account?", use_container_width=True):
                    st.session_state.show_signup = False
                    st.session_state.show_login = True
                    st.rerun()
            
            if signup_btn and username and email and password and confirm_password:
                if password != confirm_password:
                    st.error("Passwords don't match")
                elif len(password) < 6:
                    st.error("Password must be at least 6 characters")
                else:
                    success, message = register_user(username, email, password)
                    if success:
                        st.success(message)
                        st.session_state.show_signup = False
                        st.session_state.show_login = True
                        st.rerun()
                    else:
                        st.error(message)


def render_settings_sidebar():
    """Render settings sidebar"""
    with st.sidebar:
        st.markdown("---")
        st.markdown("### ⚙️ Settings")
        
        # Theme Settings
        st.session_state.user_settings['theme'] = st.selectbox(
            "Theme",
            ["Light", "Dark", "Auto"],
            index=["Light", "Dark", "Auto"].index(st.session_state.user_settings['theme'])
        )
        
        # Notifications
        st.session_state.user_settings['notifications'] = st.toggle(
            "Enable Notifications",
            value=st.session_state.user_settings['notifications']
        )
        
        # Auto Refresh
        st.session_state.user_settings['auto_refresh'] = st.toggle(
            "Auto Refresh Data",
            value=st.session_state.user_settings['auto_refresh']
        )
        
        # Chart Type
        st.session_state.user_settings['chart_type'] = st.selectbox(
            "Chart Style",
            ["Standard", "Modern", "Classic"],
            index=["Standard", "Modern", "Classic"].index(st.session_state.user_settings['chart_type'])
        )
        
        # Language
        st.session_state.user_settings['language'] = st.selectbox(
            "Language",
            ["English", "Spanish", "French", "German"],
            index=["English", "Spanish", "French", "German"].index(st.session_state.user_settings['language'])
        )
        
        st.markdown("---")
        
        # User Profile (if logged in)
        if st.session_state.user_logged_in:
            st.markdown("### 👤 Profile")
            st.info(f"Logged in as: **{st.session_state.current_user}**")
            
            if st.button("🚪 Logout", use_container_width=True):
                st.session_state.user_logged_in = False
                st.session_state.current_user = None
                st.success("Logged out successfully!")
                st.rerun()


def render_header():
    """Render the main header with logo and auth buttons"""
    col1, col2, col3 = st.columns([1, 4, 1])
    
    with col1:
        # Innovative Logo
        logo_html = f"""
        <div style="display: flex; align-items: center; gap: 10px;">
            {create_innovative_logo()}
            <div style="font-size: 1.2rem; font-weight: bold; color: #1f77b4;">
                InvenAI
            </div>
        </div>
        """
        st.markdown(logo_html, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <h1 style="text-align: center; color: #1f77b4; margin: 0;">
            GenAI Smart Inventory Optimizer
        </h1>
        <p style="text-align: center; color: #666; margin: 0;">
            Intelligent EV Manufacturing Inventory Management
        </p>
        """, unsafe_allow_html=True)
    
    with col3:
        if st.session_state.user_logged_in:
            # User is logged in - show user menu
            st.markdown(f"""
            <div style="text-align: right; color: #1f77b4; font-weight: bold;">
                Welcome, {st.session_state.current_user}!
            </div>
            """, unsafe_allow_html=True)
            
            col_ai, col_settings = st.columns(2)
            with col_ai:
                if st.button("🤖", help="AI Assistant", key="ai_button"):
                    st.session_state.show_ai_chat = True
            with col_settings:
                if st.button("⚙️", help="Settings", key="settings_button"):
                    st.session_state.show_settings = not st.session_state.show_settings
        else:
            # User not logged in - show auth buttons
            col_login, col_signup = st.columns(2)
            with col_login:
                if st.button("🔐 Login", key="login_button", use_container_width=True):
                    st.session_state.show_login = True
            with col_signup:
                if st.button("👤 Sign Up", key="signup_button", use_container_width=True):
                    st.session_state.show_signup = True


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
    df = generate_all_parts_data()
    
    # Save data
    os.makedirs("data", exist_ok=True)
    df.to_csv(data_path, index=False)
    
    return df


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


def create_3d_surface_plot(forecast_df):
    """Create 3D surface plot for demand visualization"""
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
                    colorbar=dict(title="Moving Average")
                ),
                line=dict(color='rgba(0,100,80,0.6)', width=2),
                name='Demand Surface'
            )
        ])
        
        fig_3d_surface.update_layout(
            title="3D Demand Surface Analysis",
            scene=dict(
                xaxis_title="Time Progression (%)",
                yaxis_title="Daily Demand",
                zaxis_title="Moving Average",
                camera=dict(
                    eye=dict(x=1.5, y=1.5, z=1.5)
                )
            ),
            height=500
        )
        
        return fig_3d_surface
    return None


def create_3d_scatter_plot(forecast_df):
    """Create 3D scatter plot for multi-dimensional analysis"""
    if len(forecast_df) > 10:
        # Add time component
        forecast_df['day_of_year'] = pd.to_datetime(forecast_df['date']).dt.dayofyear
        
        fig_3d_scatter = go.Figure(data=[
            go.Scatter3d(
                x=forecast_df['day_of_year'],
                y=forecast_df['demand'].fillna(0),
                z=forecast_df['sma'].fillna(0),
                mode='markers',
                marker=dict(
                    size=6,
                    color=forecast_df['demand'].fillna(0),
                    colorscale='Rainbow',
                    showscale=True,
                    opacity=0.8,
                    colorbar=dict(title="Demand Level")
                ),
                text=forecast_df['date'].dt.strftime('%Y-%m-%d'),
                hovertemplate='<b>Date:</b> %{text}<br>' +
                             '<b>Day of Year:</b> %{x}<br>' +
                             '<b>Demand:</b> %{y}<br>' +
                             '<b>SMA:</b> %{z}<extra></extra>',
                name='Demand Points'
            )
        ])
        
        fig_3d_scatter.update_layout(
            title="3D Scatter Plot: Demand vs Time vs Moving Average",
            scene=dict(
                xaxis_title="Day of Year",
                yaxis_title="Daily Demand",
                zaxis_title="Moving Average",
                camera=dict(
                    eye=dict(x=1.2, y=1.2, z=1.2)
                )
            ),
            height=500
        )
        
        return fig_3d_scatter
    return None


def create_multi_part_3d_plot(inventory_data, selected_parts):
    """Create 3D plot comparing multiple parts"""
    if len(selected_parts) > 1:
        fig_multi_3d = go.Figure()
        
        colors = ['red', 'blue', 'green', 'orange', 'purple']
        
        for i, part in enumerate(selected_parts[:5]):  # Limit to 5 parts for clarity
            part_data = inventory_data[inventory_data['part_name'] == part].copy()
            if not part_data.empty:
                part_data['month'] = pd.to_datetime(part_data['date']).dt.month
                part_data['rolling_avg'] = part_data['demand'].rolling(window=7, min_periods=1).mean()
                
                fig_multi_3d.add_trace(
                    go.Scatter3d(
                        x=part_data['month'],
                        y=part_data['demand'],
                        z=part_data['rolling_avg'],
                        mode='markers',
                        marker=dict(
                            size=4,
                            color=colors[i % len(colors)],
                            opacity=0.7
                        ),
                        name=part,
                        hovertemplate=f'<b>{part}</b><br>' +
                                     'Month: %{x}<br>' +
                                     'Demand: %{y}<br>' +
                                     'Rolling Avg: %{z}<extra></extra>'
                    )
                )
        
        fig_multi_3d.update_layout(
            title="Multi-Part 3D Comparison",
            scene=dict(
                xaxis_title="Month",
                yaxis_title="Daily Demand",
                zaxis_title="7-Day Rolling Average",
                camera=dict(
                    eye=dict(x=1.3, y=1.3, z=1.3)
                )
            ),
            height=500
        )
        
        return fig_multi_3d
    return None


def main():
    # Custom CSS for beautiful UI
    st.markdown("""
    <style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        border-left: 4px solid #1f77b4;
        margin: 0.5rem 0;
    }
    
    .settings-panel {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid #e9ecef;
        margin: 1rem 0;
    }
    
    .auth-button {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .auth-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    }
    
    .status-critical {
        background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    
    .status-warning {
        background: linear-gradient(45deg, #feca57, #ff9ff3);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    
    .status-healthy {
        background: linear-gradient(45deg, #48dbfb, #0abde3);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    
    .tabs-container {
        margin-top: 2rem;
    }
    
    /* Animation for loading */
    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
    
    .loading-animation {
        animation: pulse 2s infinite;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Render custom header with logo and auth
    render_header()
    
    # Handle modals
    if st.session_state.get('show_login', False):
        render_login_modal()
        return
        
    if st.session_state.get('show_signup', False):
        render_signup_modal()
        return
    
    # AI Chat Popup
    if st.session_state.get('show_ai_chat', False):
        ai_chat_popup()
    
    # Welcome message for new users
    if not st.session_state.user_logged_in:
        st.markdown("""
        <div style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 1rem; border-radius: 10px; text-align: center; margin: 1rem 0;">
            <h3 style="margin: 0;">Welcome to InvenAI Smart Inventory Optimizer</h3>
            <p style="margin: 0.5rem 0;">Please log in to access personalized features and save your settings!</p>
        </div>
        """, unsafe_allow_html=True)
    
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
    
    # Render settings sidebar if logged in
    if st.session_state.user_logged_in and st.session_state.get('show_settings', False):
        render_settings_sidebar()
    elif st.session_state.user_logged_in:
        # Show condensed settings in sidebar
        with st.sidebar:
            st.markdown("---")
            if st.button("⚙️ Settings", use_container_width=True):
                st.session_state.show_settings = True
                st.rerun()
    
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
                fig_3d_surface = create_3d_surface_plot(forecast_df)
                if fig_3d_surface:
                    st.plotly_chart(fig_3d_surface, use_container_width=True)
                else:
                    st.info("Insufficient data for 3D surface visualization")
            
            with tab_3d2:
                st.markdown("**3D Scatter Plot**: Multi-dimensional demand analysis")
                fig_3d_scatter = create_3d_scatter_plot(forecast_df)
                if fig_3d_scatter:
                    st.plotly_chart(fig_3d_scatter, use_container_width=True)
                else:
                    st.info("Insufficient data for 3D scatter visualization")
            
            with tab_3d3:
                st.markdown("**Multi-Part Comparison**: Compare multiple EV components in 3D space")
                selected_parts_3d = st.multiselect(
                    "Select parts to compare:",
                    available_parts,
                    default=available_parts[:3] if len(available_parts) >= 3 else available_parts
                )
                
                if len(selected_parts_3d) > 1:
                    fig_multi_3d = create_multi_part_3d_plot(inventory_data, selected_parts_3d)
                    if fig_multi_3d:
                        st.plotly_chart(fig_multi_3d, use_container_width=True)
                else:
                    st.info("Select at least 2 parts to compare")
    
    with tab2:
        st.subheader("🏆 EV Parts Performance Leaderboard")
        
        # Generate leaderboard
        leaderboard_df = generate_leaderboard(inventory_data)
        
        if not leaderboard_df.empty:
            # Sort options
            sort_options = {
                'avg_demand': 'Average Demand',
                'growth_rate': 'Growth Rate',
                'volatility': 'Volatility (Lower is Better)',
                'quality_score': 'Data Quality Score'
            }
            
            sort_by = st.selectbox(
                "Sort leaderboard by:",
                options=list(sort_options.keys()),
                format_func=lambda x: sort_options[x],
                index=0
            )
            
            # Re-generate leaderboard with new sorting
            leaderboard_df = generate_leaderboard(inventory_data, sort_by=sort_by)
            
            # Display leaderboard
            st.dataframe(
                leaderboard_df,
                use_container_width=True,
                hide_index=True
            )
            
            # Visualization
            col1, col2 = st.columns(2)
            
            with col1:
                # Bar chart of average demand
                fig_bar = px.bar(
                    leaderboard_df,
                    x='part_name',
                    y='avg_demand',
                    title='Average Daily Demand by Part',
                    color='avg_demand',
                    color_continuous_scale='Blues'
                )
                fig_bar.update_layout(xaxis_title="EV Part", yaxis_title="Average Daily Demand")
                st.plotly_chart(fig_bar, use_container_width=True)
            
            with col2:
                # Scatter plot of growth vs volatility
                fig_scatter = px.scatter(
                    leaderboard_df,
                    x='growth_rate',
                    y='volatility',
                    size='avg_demand',
                    color='quality_score',
                    hover_data=['part_name'],
                    title='Growth Rate vs Volatility',
                    color_continuous_scale='Viridis'
                )
                fig_scatter.update_layout(
                    xaxis_title="Annual Growth Rate (%)",
                    yaxis_title="Volatility (CV)"
                )
                st.plotly_chart(fig_scatter, use_container_width=True)
    
    with tab3:
        st.subheader("📊 Detailed Analytics")
        
        # Part selection for detailed analysis
        analysis_part = st.selectbox(
            "Select part for detailed analysis:",
            available_parts,
            key="analysis_part"
        )
        
        # Calculate detailed statistics
        stats = calculate_part_statistics(inventory_data, analysis_part)
        
        if 'error' not in stats:
            # Basic statistics
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("#### 📈 Basic Statistics")
                basic_stats = stats['basic_statistics']
                
                metrics_col1, metrics_col2 = st.columns(2)
                with metrics_col1:
                    st.metric("Mean Demand", f"{basic_stats['mean']:.1f}")
                    st.metric("Std Deviation", f"{basic_stats['std']:.1f}")
                    st.metric("Minimum", f"{basic_stats['min']:.0f}")
                
                with metrics_col2:
                    st.metric("Median Demand", f"{basic_stats['median']:.1f}")
                    st.metric("Coefficient of Variation", f"{basic_stats['cv']:.3f}")
                    st.metric("Maximum", f"{basic_stats['max']:.0f}")
            
            with col2:
                st.markdown("#### 📊 Trend Analysis")
                trend_stats = stats['trend_analysis']
                
                if 'error' not in trend_stats:
                    st.metric("Annual Growth Rate", f"{trend_stats['annual_growth_rate']:.2f}%")
                    st.metric("R-squared", f"{trend_stats['r_squared']:.3f}")
                    st.metric("Trend Direction", trend_stats['trend_direction'].title())
                else:
                    st.info("Insufficient data for trend analysis")
            
            # Demand distribution
            st.markdown("#### 📊 Demand Distribution")
            part_data = inventory_data[inventory_data['part_name'] == analysis_part]
            
            fig_hist = px.histogram(
                part_data,
                x='demand',
                nbins=30,
                title=f'Demand Distribution for {analysis_part}',
                marginal='box'
            )
            fig_hist.update_layout(
                xaxis_title="Daily Demand",
                yaxis_title="Frequency"
            )
            st.plotly_chart(fig_hist, use_container_width=True)
            
            # Volatility and seasonality
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("#### 🌊 Volatility Analysis")
                volatility_stats = stats['volatility_analysis']
                st.write(f"**Volatility Level:** {volatility_stats['volatility_level']}")
                st.write(f"**Coefficient of Variation:** {volatility_stats['overall_coefficient_of_variation']:.3f}")
            
            with col2:
                st.markdown("#### 🔄 Data Quality")
                quality_stats = stats['data_quality']
                st.write(f"**Quality Grade:** {quality_stats['quality_grade']}")
                st.write(f"**Completeness Rate:** {quality_stats['completeness_rate']:.1%}")
                st.write(f"**Outlier Rate:** {quality_stats['outlier_rate']:.1%}")
        else:
            st.error("Unable to calculate statistics for the selected part")


if __name__ == "__main__":
    main()
