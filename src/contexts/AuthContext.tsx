import firebase from "firebase";
import React, { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContextType } from "../interface/AuthContext";
import { User } from "../interface/User";
import { auth } from "../services/firebase";

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const history = useHistory();

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account.");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL as string,
      });
    }
  };

  const signOut = async () => {
    if (user) {
      await auth.signOut();
      setUser(undefined);
      history.push("/");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account.");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL as string,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
