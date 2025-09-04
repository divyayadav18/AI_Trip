import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateTrip from "./create-trip";
import Viewtrip from "./view-trip/[tripId]";
import CheckAvailability from "./view-trip/components/CheckAvl";
import HotelDetail from "./view-trip/components/BookHotel";
import Header from "./components/custom/Header";
import Hero from "./components/custom/Hero";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./service/firebaseConfig";
import Payment from "./view-trip/components/Payment";
import './components/custom/Front.css';
import './components/custom/Header.css';
import './components/custom/Weather.css';
import './components/custom/chatbot.css';
import { AuthContext } from "./AuthContext";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
      const userData = {
        name: currentUser.displayName,
        email: currentUser.email,
        picture: currentUser.photoURL || null,
      };
      console.log("Auth State Changed:", currentUser);
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
    }
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider values={{user,isLoggedIn,setUser,setIsLoggedIn}}>
    <Router>
    {/*  <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} user={user} />*/}
    <Header/>
      <Routes><Route path="/" element={<Hero />} />
        <Route path="/create-trip" element={<CreateTrip isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/book-hotel/:hotelId" element={<HotelDetail isLoggedIn={isLoggedIn} user={user} />} />
        <Route path="/view-trip/:tripId" element={<Viewtrip isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/check-availability/:hotelId" element={<CheckAvailability isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>} />
        <Route path="/Payment" element={<Payment isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>} /> </Routes>
    </Router>
    </AuthContext.Provider>
  );
}
export default App;

