import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Create or update user profile in Firestore
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  
  try {
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      // Create new user profile
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: additionalData.role || '',
        mobileNumber: additionalData.mobileNumber || '',
        isProfileComplete: Boolean(additionalData.role),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...additionalData
      };
      
      await setDoc(userRef, userData);
      return userData;
    } else {
      // Update existing user profile
      const updateData = {
        ...additionalData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, updateData);
      return { ...userSnapshot.data(), ...updateData };
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  if (!uid) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid, updates) => {
  if (!uid) return;

  try {
    const userRef = doc(db, 'users', uid);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updateData);
    return updateData;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Extract user info from Google Auth result
export const extractGoogleUserInfo = (user) => {
  return {
    displayName: user.displayName || '',
    email: user.email || '',
    photoURL: user.photoURL || '',
    // Split display name into first and last name
    firstName: user.displayName ? user.displayName.split(' ')[0] : '',
    lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : ''
  };
};