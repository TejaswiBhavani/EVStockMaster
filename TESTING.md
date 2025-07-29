# Testing Guide for EVStockMaster

## Quick Start Testing

### 1. Frontend (React App) Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Navigate to `http://localhost:5173`
   - Test the responsive design by resizing the browser
   - Check the sidebar navigation works on desktop and mobile

3. **Test Core Features:**
   - **Dashboard Tab**: View key metrics and quick actions
   - **3D Model Tab**: Interactive EV component visualization
   - **Inventory Tab**: Parts management and filtering
   - **AI Summary Tab**: View AI-generated insights

4. **Build Testing:**
   ```bash
   npm run build
   npm run preview
   ```
   Navigate to `http://localhost:4173` to test the production build

### 2. Backend (Streamlit App) Testing

1. **Start the Streamlit server:**
   ```bash
   streamlit run app.py
   ```

2. **Access the application:**
   - Navigate to `http://localhost:8501`
   - Test user authentication (sign up/login)
   - Verify data generation and visualization

3. **Test Core Features:**
   - **Dashboard**: Real-time metrics and inventory status
   - **Leaderboard**: Parts performance comparison
   - **Analytics**: Detailed statistical analysis
   - **AI Chat**: Interactive inventory assistant
   - **3D Visualizations**: Surface plots and scatter analysis

## Component Testing

### React Components

1. **Sidebar Navigation:**
   - Click each menu item to verify navigation
   - Test mobile menu toggle
   - Verify active state highlighting

2. **3D Model Viewer:**
   - Click on different EV parts
   - Test rotation and zoom controls
   - Verify part selection triggers info panel

3. **Inventory Table:**
   - Sort by different columns
   - Test search/filter functionality
   - Verify stock status indicators

4. **AI Summary:**
   - Check confidence scores display
   - Verify recommendations formatting
   - Test responsive layout

### Streamlit Components

1. **User Authentication:**
   - Test user registration
   - Test user login/logout
   - Verify session persistence

2. **Data Generation:**
   - Generate synthetic inventory data
   - Verify data persistence in CSV files
   - Test data refresh functionality

3. **Forecasting:**
   - Select different EV parts
   - Adjust forecasting parameters
   - Verify charts update correctly

4. **AI Insights:**
   - Test stock status calculations
   - Verify recommendations logic
   - Check inventory alerts

## Data Testing

### Mock Data Verification

1. **EV Parts Data:**
   ```javascript
   // Verify in browser console
   console.log(evParts.length); // Should show 6 parts
   console.log(evParts.map(p => p.name)); // List all part names
   ```

2. **Production Schedule:**
   ```javascript
   console.log(productionSchedule.length); // Should show 3 schedules
   ```

3. **AI Insights:**
   ```javascript
   console.log(aiInsights.overall.confidence); // Should show 94
   ```

### Python Data Generation

1. **Test data generation:**
   ```bash
   python -c "
   from modules.data_generator import generate_all_parts_data
   data = generate_all_parts_data()
   print(f'Generated {len(data)} records for {data[\"part_name\"].nunique()} parts')
   "
   ```

2. **Test forecasting:**
   ```bash
   python -c "
   from modules.data_generator import generate_all_parts_data
   from modules.forecasting import generate_forecast
   data = generate_all_parts_data()
   forecast = generate_forecast(data, 'Battery Pack')
   print(f'Forecast generated with {len(forecast)} data points')
   "
   ```

## Integration Testing

### Firebase Integration (Optional)

1. **Authentication Testing:**
   - Test Google sign-in
   - Test email/password authentication
   - Verify user data persistence

2. **Firestore Testing:**
   - Test data read/write operations
   - Verify real-time updates
   - Test offline functionality

### API Integration

1. **Mock API Responses:**
   - Verify data fetching
   - Test error handling
   - Check loading states

## Performance Testing

### Frontend Performance

1. **Lighthouse Testing:**
   - Run Chrome DevTools Lighthouse
   - Target: Performance > 80, Accessibility > 90

2. **Bundle Size Analysis:**
   ```bash
   npm run build
   # Check dist/ folder sizes
   ls -la dist/assets/
   ```

3. **3D Performance:**
   - Test on lower-end devices
   - Monitor frame rate in 3D model viewer
   - Check memory usage

### Backend Performance

1. **Data Processing:**
   - Test with large datasets (10,000+ records)
   - Monitor memory usage during analysis
   - Check forecast generation time

2. **Streamlit Performance:**
   - Test concurrent user sessions
   - Monitor response times
   - Check caching effectiveness

## Error Testing

### Common Error Scenarios

1. **Network Issues:**
   - Test offline functionality
   - Verify error messages
   - Check retry mechanisms

2. **Invalid Data:**
   - Test with empty datasets
   - Verify error handling for invalid inputs
   - Check graceful degradation

3. **Browser Compatibility:**
   - Test on Chrome, Firefox, Safari, Edge
   - Verify mobile browser compatibility
   - Check responsive design breakpoints

## Deployment Testing

### Production Build

1. **React Production:**
   ```bash
   npm run build
   # Test the built files
   npm run preview
   ```

2. **Firebase Deployment:**
   ```bash
   npm run deploy
   # Test the deployed application
   ```

### Environment Variables

1. **Test configuration:**
   - Verify Firebase config loading
   - Test different environment settings
   - Check production vs development modes

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Clear node_modules: `rm -rf node_modules && npm install --legacy-peer-deps`
   - Check Node.js version (>=18 recommended)

2. **Python Import Errors:**
   - Install dependencies: `pip install -r requirements.txt`
   - Check Python version (>=3.11 recommended)

3. **Firebase Issues:**
   - Verify Firebase configuration
   - Check network connectivity
   - Review Firebase console logs

### Debug Mode

1. **React Debug:**
   ```bash
   npm run dev -- --debug
   ```

2. **Streamlit Debug:**
   ```bash
   streamlit run app.py --logger.level debug
   ```

## Automated Testing (Future)

### Setup Jest for React

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Setup Pytest for Python

```bash
pip install pytest pytest-cov
```

### Example Test Commands

```bash
# React tests
npm test

# Python tests  
pytest tests/ -v --cov=modules/
```

## Reporting Issues

When reporting issues, please include:

1. **Environment Information:**
   - Operating System
   - Browser version
   - Node.js version
   - Python version

2. **Steps to Reproduce:**
   - Exact steps taken
   - Expected behavior
   - Actual behavior

3. **Error Messages:**
   - Console logs
   - Error screenshots
   - Network logs if relevant

4. **Additional Context:**
   - Data being used
   - Configuration settings
   - Recent changes made