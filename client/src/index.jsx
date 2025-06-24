import { Route, Routes } from "react-router";
import Nav from "./components/Nav";
import App from "./App";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { BettingProvider } from "./contexts/BettingContext";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createContext, useEffect, useState } from "react";
import Add from "./pages/Add";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const auth = getAuth();

export const Context = createContext();

const Index = () => {
  const [user, setUser] = useState(false);
  const [bearBucks, setBearBucks] = useState(1500); // Initialize with default value

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
    });
  }, []);

  //   const docRef = doc(db, "Users", "P9sltO4r1DYRySceULuVNBKA4og1");

  //   console.log(docRef);
  //   getDoc(docRef).then((docSnap) => {
  //     console.log(docSnap);
  //     if (docSnap.exists()) {
  //       console.log("Document data:", docSnap.data());
  //     } else {
  //       // docSnap.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   });

  return (
    <div>
      <Context.Provider
        value={{
          user: user,
          setUser: setUser,
          db: db,
          bearBucks: bearBucks,
          setBearBucks: setBearBucks,
        }}
      >
        <BettingProvider>
          <Nav />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<Add />} />
          </Routes>
        </BettingProvider>
      </Context.Provider>
    </div>
  );
};

export default Index;
