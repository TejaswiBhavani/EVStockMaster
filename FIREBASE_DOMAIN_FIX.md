# Firebase Setup and Configuration Guide

## 🔥 Complete Firebase Setup for EVStockMaster

This guide will walk you through setting up Firebase for the EVStockMaster application, including authentication, database, and hosting configuration.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Google account for Firebase Console access

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Click "Create a project"**
3. **Enter project name**: `evstockmaster` (or your preferred name)
4. **Enable Google Analytics** (recommended)
5. **Select Analytics account** and click "Create project"

## Step 2: Enable Required Services

### Authentication Setup
1. In Firebase Console, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Google** sign-in provider:
   - Click on Google
   - Toggle "Enable"
   - Add your support email
   - Click "Save"
4. Go to **Settings** → **Authorized domains**
5. Add your domains:
   ```
   localhost
   127.0.0.1
   yourdomain.com
   yourapp.vercel.app
   yourapp.netlify.app
   ```

### Firestore Database Setup
1. Go to **Firestore Database** → **Create database**
2. Select **Start in production mode** (recommended)
3. Choose your database location (closest to your users)
4. Click "Done"

### Storage Setup (Optional)
1. Go to **Storage** → **Get started**
2. Review security rules and click "Next"
3. Choose storage location and click "Done"

## Step 3: Get Firebase Configuration

1. Go to **Project Overview** → **Project settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app icon** (</>) to add a web app
4. Enter app nickname: `EVStockMaster`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. **Copy the configuration object**:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:your-app-id",
  measurementId: "G-YOUR-MEASUREMENT-ID"
};
```

## Step 4: Configure Environment Variables

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file** with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=G-YOUR-MEASUREMENT-ID
   ```

## Step 5: Update Firebase Configuration File

1. **Open** `src/config/firebase.js`
2. **Replace** the configuration object with your values:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
   };
   ```

## Step 6: Configure Firebase CLI

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize Firebase in your project**:
   ```bash
   firebase init
   ```

3. **Select services** to set up:
   - ✅ Firestore: Configure security rules and indexes
   - ✅ Hosting: Configure files for Firebase Hosting
   - ✅ Storage: Configure security rules for Cloud Storage

4. **Choose existing project** and select your Firebase project

5. **Configure Firestore**:
   - Use default file `firestore.rules`
   - Use default file `firestore.indexes.json`

6. **Configure Hosting**:
   - Set public directory: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds with GitHub: `No` (or Yes if desired)

## Step 7: Set Up Firestore Security Rules

Update `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Inventory data - authenticated users can read, admins can write
    match /inventory/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.createdBy == request.auth.uid;
    }
    
    // Public read access for certain collections
    match /parts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 8: Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

## Step 9: Test Firebase Connection

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Test authentication**:
   - Open the app in your browser
   - Try signing in with Google
   - Check browser console for any errors

## Step 10: Deploy to Firebase Hosting (Optional)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

3. **Access your deployed app**:
   - URL will be displayed after deployment
   - Usually: `https://your-project-id.web.app`

## Troubleshooting Common Issues

### Domain Authorization Error
**Error**: `Firebase: Error (auth/unauthorized-domain)`

**Solution**:
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your current domain (e.g., `localhost`, `yourapp.vercel.app`)

### Configuration Not Found
**Error**: `Firebase: No Firebase App '[DEFAULT]' has been created`

**Solution**:
1. Verify `.env` file has correct Firebase configuration
2. Restart development server
3. Check that environment variables start with `VITE_`

### Build Errors
**Error**: Build fails with Firebase import errors

**Solution**:
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

## Security Best Practices

1. **Never commit** `.env` files with real credentials
2. **Use different Firebase projects** for development and production
3. **Set up proper Firestore security rules**
4. **Enable Firebase App Check** for production
5. **Monitor Firebase usage** and set up billing alerts

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## Domain Authorization Issues (Legacy)

If you're experiencing `Firebase: Error (auth/unauthorized-domain)`, refer to the enhanced error handling in the application which will provide:
- Clear indication when domain authorization is the issue
- Current domain information for debugging
- Direct link to Firebase Console
- Step-by-step instructions