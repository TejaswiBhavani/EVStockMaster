# EVStockMaster Architecture

This PR introduces:

- **Frontend (Vite + React + Tailwind)**
  - 3D: Three.js with react-three-fiber and postprocessing
    - `src/components/3D/EVModel.jsx` mounts the scene, lights, and controls
    - `src/components/3D/CarModel.jsx` builds a stylized EV with better body, wheels, and glass
    - `src/components/3D/PostFX.jsx` adds Bloom/SSAO
  - Analytics:
    - `src/components/supplychain/SupplyChainSankey.jsx` (D3 Sankey)
    - `src/components/charts/CorrelationHeatmap.jsx` (D3 heatmap)
    - `src/pages/PolicyCalendar.jsx` (policy timeline)
    - `src/pages/AnalyticsPage.jsx` (combines all analytics features)
  - Realtime:
    - `src/hooks/useSSE.js` hook connects to `/api/alerts/stream` (SSE)
  - Utils:
    - `src/utils/thematicBaskets.js` predefined investment baskets

- **Backend (Python)**
  - FastAPI at `server/api/main.py` for compute endpoints (alerts, sentiment, correlations)
  - Keep Streamlit for prototyping UI
  - Vercel rewrites route `/api/*` to FastAPI locally; use Nginx in production if needed

- **CI/CD**
  - `.github/workflows/ci.yml` builds frontend, runs tests, validates Docker

- **PWA**
  - `public/manifest.webmanifest`

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI       │    │   Streamlit     │
│   (React/Vite)  │◄──►│   Backend       │    │   (Analytics)   │
│                 │    │   (API Server)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   SSE Stream    │    │   Data Analysis │
│   (Vercel)      │    │   (Real-time)   │    │   (Batch)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Structure

### 3D Visualization
- **EVModel.jsx**: Main 3D scene with enhanced lighting and post-processing
- **CarModel.jsx**: Detailed car geometry with interactive parts
- **PostFX.jsx**: Bloom, SSAO, and ACES tone mapping effects
- **Wheel.jsx**: Modular wheel component with selection states

### Analytics Dashboard
- **AnalyticsPage.jsx**: Main analytics view combining all visualizations
- **SupplyChainSankey.jsx**: D3-based Sankey diagram for supply chain flows
- **CorrelationHeatmap.jsx**: D3-based correlation matrix visualization
- **PolicyCalendar.jsx**: Timeline of regulatory events

### Real-time Features
- **useSSE.js**: Server-Sent Events hook for live updates
- **FastAPI Endpoints**: `/api/alerts/stream` for real-time data

## API Endpoints

### FastAPI (`server/api/main.py`)
- `GET /health` - Health check
- `GET /alerts` - Get current alerts
- `GET /alerts/stream` - SSE stream for real-time alerts
- `GET /sentiment?symbol=TSLA` - Sentiment analysis for symbol
- `POST /correlations` - Correlation matrix for symbol list

## Development Setup

1. **Frontend**: `npm run dev`
2. **API Server**: `npm run api`
3. **Streamlit**: `npm run streamlit`

## Security Features
- Content Security Policy (CSP) headers
- HTTP Strict Transport Security (HSTS)
- CORS configuration for development

## PWA Support
- Service worker ready
- App manifest configured
- Offline capability structure in place

## Next Steps
- Add watchlists, shareable deep links, onboarding tips
- Prebuilt baskets with quick backtests
- Real news/sentiment + delivery calendars
- Redis/file caching, and API rate-limit aware ingestion via GitHub Actions
- Enhanced mobile responsiveness
- Real-time collaboration features