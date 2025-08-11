// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import {
  getCurrentDomainInfo,
  isDomainLikelyUnauthorized,
  getFirebaseConsoleAuthURL,
} from './domains'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
// Force account picker for Google sign-in to reduce confusion
googleProvider.setCustomParameters({ prompt: 'select_account' })
export const db = getFirestore(app)
export const storage = getStorage(app)

// Domain debugging utilities
export const domainUtils = {
  getCurrentDomainInfo,
  isDomainLikelyUnauthorized,
  getFirebaseConsoleAuthURL: () => getFirebaseConsoleAuthURL(firebaseConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID),
  getRequiredDomainsMessage: () => {
    const { origin } = getCurrentDomainInfo()
    return `
To fix authentication issues, add these domains to Firebase Console:

1. Go to: ${getFirebaseConsoleAuthURL(firebaseConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID)}
2. Add your current domain: ${origin}
3. Also add common domains like: localhost, 127.0.0.1, vercel.app, etc.

Current domain info:
- Origin: ${origin}
- Likely needs authorization: ${isDomainLikelyUnauthorized() ? 'YES' : 'NO'}
    `
  },
}

export default app
