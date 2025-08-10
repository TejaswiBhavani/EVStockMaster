# EVStockMaster - Smart Inventory Management Platform

![EVStockMaster Logo](https://github.com/TejaswiBhavani/EVStockMaster/blob/main/public/favicon.svg)

## 🚀 Overview

**EVStockMaster** is a comprehensive AI-powered inventory management platform specifically designed for Electric Vehicle (EV) manufacturing operations. The application features a dual architecture with both modern React frontend and Streamlit backend components, providing multiple interfaces for different use cases.

### 🏗️ Architecture

- **React Frontend**: Modern, responsive UI with 3D visualization and interactive dashboards
- **Streamlit Backend**: Python-based analytics engine with AI-powered insights and forecasting
- **Dual Interface**: Choose between web-first React app or data-science focused Streamlit app

### ✨ Key Features

- **🎯 Interactive 3D EV Model Viewer** - Click on parts to view detailed information
- **📊 Real-time Dashboard** - Live inventory metrics and production schedules
- **🤖 AI-Powered Analytics** - Smart insights and recommendations
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile
- **⚡ Real-time Updates** - Live data synchronization
- **🔍 Advanced Search & Filtering** - Find parts and data quickly

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### 3D Visualization

- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

### Backend & Database

- **Firebase** - Authentication, Firestore database, hosting
- **Firebase Analytics** - User behavior tracking

### UI/UX

- **Lucide React** - Beautiful icon library
- **Custom Design System** - Consistent styling and components

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm or yarn** - Package manager (comes with Node.js)
- **Python 3.8+** - [Download Python](https://python.org/) (for Streamlit backend)
- **Firebase account** - [Create Firebase account](https://console.firebase.google.com)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/TejaswiBhavani/EVStockMaster.git
cd EVStockMaster
```

#### 2. Install Frontend Dependencies

```bash
# Install Node.js dependencies
npm install --legacy-peer-deps

# Or using yarn
yarn install
```

#### 3. Install Backend Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or using virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your Firebase configuration
# See Firebase Setup Guide below for detailed instructions
```

#### 5. Firebase Setup (Required)

Follow our comprehensive [Firebase Setup Guide](./FIREBASE_DOMAIN_FIX.md) to:

- Create a Firebase project
- Enable Authentication and Firestore
- Configure authorized domains
- Get your Firebase configuration keys

#### 6. Run the Applications

**Frontend (React) - Terminal 1:**

```bash
npm run dev
# App will be available at http://localhost:5173
```

**Backend (Streamlit) - Terminal 2:**

```bash
npm run streamlit
# Or directly: streamlit run app.py
# App will be available at http://localhost:8501
```

### Development Workflow

```bash
# Start both applications simultaneously
npm run dev    # Terminal 1 - React frontend
npm run streamlit   # Terminal 2 - Streamlit backend

# Run tests
npm test                 # Unit tests
npm run test:ui         # Test UI interface
npm run test:coverage   # Coverage report

# Code quality
npm run lint    # ESLint checking
npm run build   # Production build
```

## 📁 Project Structure

```
EVStockMaster/
├── public/                 # Static assets
│   ├── favicon.svg         # App icon
│   └── images/            # Static images
├── src/
│   ├── components/         # React components
│   │   ├── Layout/         # Sidebar, Header components
│   │   ├── 3D/            # Three.js 3D model components
│   │   ├── Dashboard/      # Dashboard widgets and charts
│   │   ├── Inventory/      # Inventory management tables
│   │   ├── InfoPanel/      # Information panels and details
│   │   ├── Chat/          # AI chatbot components
│   │   ├── Auth/          # Authentication modals
│   │   └── Settings/      # User settings and preferences
│   ├── config/            # Configuration files
│   │   ├── firebase.js    # Firebase initialization
│   │   └── domains.js     # Domain management utilities
│   ├── data/              # Mock data and constants
│   ├── hooks/             # Custom React hooks
│   │   ├── useTheme.jsx   # Theme management
│   │   └── useResponsive.js # Responsive design utilities
│   ├── main.jsx           # React app entry point
│   ├── App.jsx            # Main application component
│   └── index.css          # Global styles and Tailwind
├── modules/               # Python backend modules
│   ├── data_generator.py  # Synthetic data generation
│   ├── forecasting.py     # Demand forecasting algorithms
│   ├── insight_engine.py  # AI insights and recommendations
│   └── analytics.py       # Statistical analysis functions
├── app.py                 # Streamlit backend application
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies and scripts
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── eslint.config.js       # ESLint configuration
├── firebase.json          # Firebase hosting configuration
├── vercel.json           # Vercel deployment configuration
└── README.md             # Project documentation
```

## 🎨 Features Deep Dive

### 1. Interactive 3D Model Viewer

- **Clickable EV Parts**: Battery, Motor, Chassis, Wheels, Dashboard, Seats
- **Smooth Animations**: Hover effects and selection highlighting
- **Orbital Controls**: Rotate, zoom, and pan the 3D model
- **Real-time Updates**: Part status reflected in 3D visualization

### 2. Smart Dashboard

- **Key Metrics**: Total parts, low stock alerts, inventory value
- **Production Schedule**: Upcoming manufacturing plans
- **Quick Actions**: Navigate to different sections
- **Real-time Data**: Live updates every 15 minutes

### 3. AI-Powered Analytics

- **Confidence Scoring**: 94% analysis accuracy
- **Smart Recommendations**: Automated inventory suggestions
- **Trend Analysis**: 30-day performance tracking
- **Predictive Insights**: Future demand forecasting

### 4. Advanced Inventory Management

- **Sortable Tables**: Sort by name, stock, cost, supplier
- **Health Indicators**: Excellent, Good, Warning, Critical
- **Search & Filter**: Find parts quickly
- **Supplier Management**: Track supplier information

### 5. Responsive Info Panel

- **Part Details**: Specifications, location, cost
- **AI Summary**: Intelligent analysis and recommendations
- **Mobile Optimized**: Smooth animations and touch-friendly

## 🔧 Configuration

### Firebase Setup

Update `src/config/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'your-app-id',
}
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 📱 Responsive Design

EVStockMaster is built with a mobile-first approach:

- **Desktop (1024px+)**: Full sidebar, multi-column layouts
- **Tablet (768px-1023px)**: Collapsible sidebar, adapted layouts
- **Mobile (<768px)**: Hamburger menu, stacked layouts, touch-optimized

## 🚀 Deployment

### Firebase Hosting (Recommended)

#### Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project configured (see Firebase Setup Guide)

#### Deploy Steps

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize Firebase (if not done already)
firebase init

# 3. Build the project
npm run build

# 4. Deploy to Firebase
firebase deploy

# Your app will be available at: https://your-project-id.web.app
```

### Vercel Deployment

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TejaswiBhavani/EVStockMaster)

#### Manual Deploy

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build the project
npm run build

# 3. Deploy
vercel --prod

# 4. Set environment variables in Vercel dashboard
# Add all VITE_* variables from your .env file
```

### Netlify Deployment

#### Drag & Drop Deploy

1. Build the project: `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag the `dist` folder to deploy

#### Git Integration

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Docker Deployment

#### Frontend Container

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Container

```dockerfile
# Dockerfile.streamlit
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - '80:80'
    environment:
      - NODE_ENV=production

  backend:
    build:
      context: .
      dockerfile: Dockerfile.streamlit
    ports:
      - '8501:8501'
    environment:
      - STREAMLIT_SERVER_PORT=8501
```

### Environment Variables for Production

Create `.env.production` with:

```env
# Firebase Production Config
VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-production-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-production-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-production-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-production-sender-id
VITE_FIREBASE_APP_ID=your-production-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-production-measurement-id

# Production Settings
VITE_NODE_ENV=production
VITE_API_BASE_URL=https://your-api-domain.com
```

### Production Checklist

- [ ] Firebase project configured for production
- [ ] Environment variables set correctly
- [ ] Firestore security rules configured
- [ ] Authentication domains added
- [ ] SSL certificate configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup (Sentry recommended)
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented

## 🧪 Testing

EVStockMaster includes a comprehensive testing setup using Vitest and React Testing Library.

### Running Tests

```bash
# Run unit tests
npm test

# Run tests with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Structure

```
src/test/
├── setup.js           # Test configuration and mocks
├── App.test.jsx       # Application tests
├── data.test.js       # Data validation tests
└── components/        # Component-specific tests
    ├── Header.test.jsx
    └── Dashboard.test.jsx
```

### Testing Features

- ✅ **Unit Tests**: Component and function testing
- ✅ **Integration Tests**: Multi-component interactions
- ✅ **Mocked Dependencies**: Firebase, Three.js, and external APIs
- ✅ **Coverage Reports**: Code coverage analysis
- ✅ **Responsive Testing**: Mobile and desktop viewports

### Writing Tests

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import YourComponent from '../components/YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TATA Motors** - Inspiration for EV manufacturing use case
- **Three.js Community** - Amazing 3D graphics library
- **React Team** - Excellent frontend framework
- **Firebase Team** - Powerful backend services

## 📞 Support

- **Documentation**: [GitHub Repository](https://github.com/TejaswiBhavani/EVStockMaster)
- **Issues**: [GitHub Issues](https://github.com/TejaswiBhavani/EVStockMaster/issues)
- **Email**: support@evstockmaster.com
- **Discord**: [Join our community](https://discord.gg/evstockmaster)

---

<div align="center">
  <p>Built with ❤️ for the future of EV manufacturing</p>
  <p>
    <a href="https://evstockmaster.vercel.app">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>
