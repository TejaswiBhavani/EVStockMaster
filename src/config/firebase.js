// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getCurrentDomainInfo, isDomainLikelyUnauthorized, getFirebaseConsoleAuthURL } from './domains';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyKrsnbDE_lLABmWQu1L3SDCqbD5aKrTc",
  authDomain: "invenai-28fa7.firebaseapp.com",
  projectId: "invenai-28fa7",
  storageBucket: "invenai-28fa7.firebasestorage.app",
  messagingSenderId: "862076243205",
  appId: "1:862076243205:web:05c30799e33b8cf0217b6c",
  measurementId: "G-N08YRPPY19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Domain debugging utilities
export const domainUtils = {
  getCurrentDomainInfo,
  isDomainLikelyUnauthorized,
  getFirebaseConsoleAuthURL: () => getFirebaseConsoleAuthURL(firebaseConfig.projectId),
  getRequiredDomainsMessage: () => {
    const { origin } = getCurrentDomainInfo();
    return `
To fix authentication issues, add these domains to Firebase Console:

1. Go to: ${getFirebaseConsoleAuthURL(firebaseConfig.projectId)}
2. Add your current domain: ${origin}
3. Also add common domains like: localhost, 127.0.0.1, vercel.app, etc.

Current domain info:
- Origin: ${origin}
- Likely needs authorization: ${isDomainLikelyUnauthorized() ? 'YES' : 'NO'}
    `;
  }
};

export default app;