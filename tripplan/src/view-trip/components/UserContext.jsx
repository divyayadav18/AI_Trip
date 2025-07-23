import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../service/firebaseConfig";

 // Ensure you have Firebase initialized

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed:", currentUser);
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
