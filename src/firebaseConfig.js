import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfBWn7NCfwx_UDWQ0FCgt7fe6shm1euHI",
  authDomain: "auth-d1b60.firebaseapp.com",
  projectId: "auth-d1b60",
  storageBucket: "auth-d1b60.appspot.com",
  messagingSenderId: "551310311476",
  appId: "1:551310311476:web:8fc85568a7672af8e68a61",
  measurementId: "G-WR7Z6MXE1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

// Export everything individually to avoid circular dependencies
export { 
  auth, 
  storage, 
  googleProvider, 
  githubProvider, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  ref,
  uploadBytes,
  getDownloadURL
}; 