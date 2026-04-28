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

/**
 * AuthStore - Manages user authentication state
 * Handles login, registration, logout, and session persistence
 */
export const useAuthStore = defineStore('auth', {
  // State: Current user session and authentication status
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isAuthenticated: false,
    isLoading: true,  // Loading state during initial auth check
  }),

  actions: {
    /**
     * Authenticates user with email and password
     * @returns true if login successful, false otherwise
     */
    async login(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Map Firebase user to our AuthUser type
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

    /**
     * Registers a new user with email, password, and name
     * @returns true if registration successful, false otherwise
     */
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

    /**
     * Signs out the current user and clears session
     */
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

    /**
     * Persists authentication state to localStorage
     */
    saveToLocalStorage() {
      localStorage.setItem('auth', JSON.stringify({
        user: this.user,
        token: this.token,
      }));
    },

    /**
     * Initializes authentication state from localStorage or Firebase
     * Called on app startup to restore user session
     */
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