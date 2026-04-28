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

// Check if Firebase is properly configured (not using placeholder values)
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.apiKey !== "" &&
         firebaseConfig.apiKey.length > 10;
};

// Initialize Firebase only if configured
let app: any = null;
let auth: any = null;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (e) {
  console.warn('Firebase initialization failed - using mock auth');
}

// Mock users for demo mode (when Firebase is not configured)
const MOCK_USERS = [
  { email: 'kminchelle@demo.com', password: '0lelplR', firstName: 'Kelley', lastName: 'Miles' },
  { email: 'demo@demo.com', password: 'demo123', firstName: 'Demo', lastName: 'User' },
];

/**
 * AuthStore - Manages user authentication state
 * Handles login, registration, logout, and session persistence
 * Falls back to mock authentication when Firebase is not configured
 */
export const useAuthStore = defineStore('auth', {
  // State: Current user session and authentication status
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isAuthenticated: false,
    isLoading: true,  // Loading state during initial auth check
    isFirebaseReady: isFirebaseConfigured(),
  }),

  actions: {
    /**
     * Authenticates user with email and password
     * @returns true if login successful, false otherwise
     */
    async login(email: string, password: string) {
      // Use mock authentication if Firebase is not configured
      if (!this.isFirebaseReady) {
        return this.mockLogin(email, password);
      }

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
      // Use mock authentication if Firebase is not configured
      if (!this.isFirebaseReady) {
        return this.mockRegister(email, password, firstName, lastName);
      }

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
     * Mock login for demo mode (when Firebase is not configured)
     */
    mockLogin(email: string, password: string) {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        this.user = {
          id: 'mock-' + Date.now(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        this.token = 'mock-token-' + Date.now();
        this.isAuthenticated = true;
        this.saveToLocalStorage();
        return true;
      }
      
      console.warn('Mock login failed - using demo credentials');
      return false;
    },

    /**
     * Mock registration for demo mode
     */
    mockRegister(email: string, password: string, firstName: string, lastName: string) {
      // Add to mock users for demo
      MOCK_USERS.push({ email, password, firstName, lastName });
      
      this.user = {
        id: 'mock-' + Date.now(),
        firstName,
        lastName,
        email,
      };
      this.token = 'mock-token-' + Date.now();
      this.isAuthenticated = true;
      this.saveToLocalStorage();
      return true;
    },

    /**
     * Signs out the current user and clears session
     */
    async logout() {
      if (this.isFirebaseReady && auth) {
        try {
          await firebaseSignOut(auth);
        } catch (error) {
          console.error('Logout error:', error);
        }
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
      // Use mock auth initialization if Firebase is not configured
      if (!this.isFirebaseReady) {
        this.isLoading = false;
        
        // Try to restore from localStorage
        const saved = localStorage.getItem('auth');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.user && data.token) {
              this.user = data.user;
              this.token = data.token;
              this.isAuthenticated = true;
            }
          } catch {
            // Ignore parse errors
          }
        }
        return Promise.resolve();
      }

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