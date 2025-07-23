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
function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed:", currentUser);
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
    })
    return () => unsubscribe();
  }, []);
  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} user={user} />
      <Routes><Route path="/" element={<Hero />} />
        <Route path="/create-trip" element={<CreateTrip isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/book-hotel/:hotelId" element={<HotelDetail isLoggedIn={isLoggedIn} user={user} />} />
        <Route path="/view-trip/:tripId" element={<Viewtrip isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/check-availability/:hotelId" element={<CheckAvailability isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>} />
        <Route path="/Payment" element={<Payment isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>} /> </Routes>
    </Router>
  );
}
export default App;

