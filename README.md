# InvenAI - Smart Inventory Management Platform

![InvenAI Logo](https://via.placeholder.com/200x80/3b82f6/ffffff?text=InvenAI)

## 🚀 Overview

**InvenAI** is an AI-powered inventory management platform specifically designed for Electric Vehicle (EV) manufacturing operations. Built with modern React technologies, it provides real-time inventory tracking, intelligent forecasting, and interactive 3D visualization of EV components.

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
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/invenai.git
   cd invenai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config to `src/config/firebase.js`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
invenai/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Layout/         # Sidebar, Header components
│   │   ├── 3D/            # 3D model components
│   │   ├── Dashboard/      # Dashboard widgets
│   │   ├── Inventory/      # Inventory management
│   │   └── InfoPanel/      # Information panels
│   ├── config/            # Firebase configuration
│   ├── data/              # Mock data and constants
│   ├── hooks/             # Custom React hooks
│   └── styles/            # CSS and styling
├── firebase.json          # Firebase hosting config
└── package.json
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
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 📱 Responsive Design

InvenAI is built with a mobile-first approach:

- **Desktop (1024px+)**: Full sidebar, multi-column layouts
- **Tablet (768px-1023px)**: Collapsible sidebar, adapted layouts  
- **Mobile (<768px)**: Hamburger menu, stacked layouts, touch-optimized

## 🚀 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   npm run deploy
   ```

3. **Access your app**
   Your app will be available at `https://your-project.web.app`

### Other Platforms
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload build files to S3 bucket

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
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

- **Documentation**: [docs.invenai.com](https://docs.invenai.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/invenai/issues)
- **Email**: support@invenai.com
- **Discord**: [Join our community](https://discord.gg/invenai)

---

<div align="center">
  <p>Built with ❤️ for the future of EV manufacturing</p>
  <p>
    <a href="https://invenai.web.app">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>