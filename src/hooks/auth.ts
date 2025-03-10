import { useState, useEffect } from "react";
import { auth, provider } from "../firebase/config";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInWithRedirect,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/popup-blocked" ||
          error.code === "auth/operation-not-supported-in-this-environment"
        ) {
          console.log("Popup blocked, switching to redirect...");
          await signInWithRedirect(auth, provider);
        }
      } else {
        console.error("Unexpected Login Error:", error);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, login, logout };
};
