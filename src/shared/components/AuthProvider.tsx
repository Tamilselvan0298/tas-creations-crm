import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isMockFirebase } from '../lib/firebase';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfileDoc: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ACCOUNTS: Record<string, { role: UserRole; name: string }> = {
  'admin@tas.com': { role: 'admin', name: 'Alexander Wright (Admin)' },
  'manager@tas.com': { role: 'manager', name: 'Sarah Connor (Manager)' },
  'sales@tas.com': { role: 'sales', name: 'Jordan Belfort (Sales)' },
  'viewer@tas.com': { role: 'viewer', name: 'John Doe (Viewer)' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isMockFirebase && auth && db) {
      return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            const docRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUser(docSnap.data() as UserProfile);
            } else {
              const defaultProfile: UserProfile = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                role: 'viewer',
                photoURL: firebaseUser.photoURL || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              await setDoc(docRef, defaultProfile);
              setUser(defaultProfile);
            }
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error(e);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });
    } else {
      const stored = localStorage.getItem('tas_mock_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('tas_mock_user'); }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    if (!isMockFirebase && auth) {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        throw new Error('Please verify your email address. A verification link has been sent.');
      }
    } else {
      const lower = email.toLowerCase();
      const mock = MOCK_ACCOUNTS[lower] || { role: 'sales', name: email.split('@')[0].toUpperCase() };
      const mockUser: UserProfile = {
        id: `mock-${lower.split('@')[0]}`,
        email: lower,
        displayName: mock.name,
        role: mock.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (rememberMe) {
        localStorage.setItem('tas_mock_user', JSON.stringify(mockUser));
      } else {
        sessionStorage.setItem('tas_mock_user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
    }
  };

  const signInWithGoogle = async () => {
    if (!isMockFirebase && auth && db) {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const docRef = doc(db, 'users', cred.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const profile: UserProfile = {
          id: cred.user.uid,
          email: cred.user.email || '',
          displayName: cred.user.displayName || 'Google User',
          role: 'viewer',
          photoURL: cred.user.photoURL || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(docRef, profile);
        setUser(profile);
      } else {
        setUser(docSnap.data() as UserProfile);
      }
    } else {
      const mockGoogle: UserProfile = {
        id: `mock-google-${Date.now()}`,
        email: 'google@tas.com',
        displayName: 'Google Demo User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localStorage.setItem('tas_mock_user', JSON.stringify(mockGoogle));
      setUser(mockGoogle);
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    if (!isMockFirebase && auth && db) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      const newProfile: UserProfile = {
        id: cred.user.uid,
        email: email.toLowerCase(),
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      throw new Error('Registration successful! Please check your email for a verification link before signing in.');
    } else {
      const mockUser: UserProfile = {
        id: `mock-${Date.now()}`,
        email: email.toLowerCase(),
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localStorage.setItem('tas_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const logout = async () => {
    if (!isMockFirebase && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem('tas_mock_user');
      sessionStorage.removeItem('tas_mock_user');
      setUser(null);
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!isMockFirebase && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      console.log(`Simulated password reset email sent to: ${email}`);
    }
  };

  const updateUserProfileDoc = async (details: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...details, updatedAt: new Date() };
      if (!isMockFirebase && db) {
        await updateDoc(doc(db, 'users', user.id), details);
      } else {
        localStorage.setItem('tas_mock_user', JSON.stringify(updated));
      }
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signUp, logout, sendPasswordReset, updateUserProfileDoc }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
