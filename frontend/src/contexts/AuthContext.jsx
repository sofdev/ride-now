import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

  const signUp = async (email, password, displayName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(user, { displayName });
    return user;
  };

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signOut = () => firebaseSignOut(auth);

  if (authLoading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, signInWithGoogle, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
