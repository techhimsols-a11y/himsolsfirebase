
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../lib/firebase'; // Import auth and db from your firebase.ts file
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  mobile?: string;
}

// User Registration
export const userRegister = async (userData: {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
  const user = userCredential.user;

  // Add user data to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    name: userData.name,
    email: userData.email,
    role: 'USER', // Default role
    mobile: userData.mobile,
  });

  return user;
};

// Regular User Login
export const userLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Get Profile
export const getProfile = async (): Promise<User | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists()) {
    return { id: user.uid, ...userDoc.data() } as User;
  }

  return null;
};

// onAuthStateChanged wrapper
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
