import { defineStore } from 'pinia';
import type { AuthUser } from '../types';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../services/firebase';

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isAuthenticated: false,
    isLoading: true,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        this.user = {
          id: firebaseUser.uid,
          firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
          lastName: firebaseUser.displayName?.split(' ')[1] || '',
          email: firebaseUser.email || email,
        };
        this.token = await firebaseUser.getIdToken();
        this.isAuthenticated = true;
        this.saveToLocalStorage();
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    async register(email: string, password: string, firstName: string, lastName: string) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        this.user = {
          id: firebaseUser.uid,
          firstName,
          lastName,
          email: firebaseUser.email || email,
        };
        this.token = await firebaseUser.getIdToken();
        this.isAuthenticated = true;
        this.saveToLocalStorage();
        return true;
      } catch (error) {
        console.error('Registration failed:', error);
        return false;
      }
    },
    async logout() {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error('Logout error:', error);
      }
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
    saveToLocalStorage() {
      localStorage.setItem('auth', JSON.stringify({
        user: this.user,
        token: this.token,
      }));
    },
    initAuth() {
      return new Promise<void>((resolve) => {
        onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          this.isLoading = false;
          if (firebaseUser) {
            this.user = {
              id: firebaseUser.uid,
              firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              email: firebaseUser.email || '',
            };
            this.token = await firebaseUser.getIdToken();
            this.isAuthenticated = true;
          } else {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
          }
          resolve();
        });
      });
    },
  },
});