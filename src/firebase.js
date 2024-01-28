import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage} from "firebase/storage"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwVCFf4OHEHHdw6BfN7C7EySYz-LlWHzM",
  authDomain: "chat-f029c.firebaseapp.com",
  projectId: "chat-f029c",
  storageBucket: "chat-f029c.appspot.com",
  messagingSenderId: "298392222418",
  appId: "1:298392222418:web:97a09c03fdf7536769cb0b"
};

export const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const storage = getStorage();
export const db = getFirestore();