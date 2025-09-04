{/*Header jsx*/}
import React, { useState, useEffect } from "react";
import "./Header.css";
import SignIn from "./SignIn";
import ChatBot from "./chatbot";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";


function Header(){
  const {user,isLoggedIn,setUser,setIsLoggedIn}=useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log("Checking sessionStorage for user session...");
    const savedUser = localStorage.getItem("user");
    const savedLoginStatus = localStorage.getItem("isLoggedIn");

    if (savedUser && savedLoginStatus === "true") {
       console.log("Restoring user session...");
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, [setUser, setIsLoggedIn]);


  const handleLogin = (userData) => {
    setUser(userData);  // user email is passed
    setIsLoggedIn(true);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
   localStorage.removeItem("user");  
  // Update React state
  setIsLoggedIn(false);
  setUser(null);
  setShowDropdown(false);
  navigate("/"); 
  };
  return (
    <div className="header">
      <img src="/travelling.jpg" alt="Logo" className="logo" />
      <div className="title-container">
      <h1 className="titles">TRAVEL AGENCY</h1>
      <span className="slogan">Plan. Travel. Explore.</span>
    </div>
     {/*User email profile section*/}
      <div className="profile-section">
      <div className="sign-in-chat-container"> 
          {/* ChatBot*/}
          <ChatBot apiKey={import.meta.env.VITE_GOOGLE_GEMINI_API_KEY} />
          {/* checks if user is looged in then show user email details*/}
        {isLoggedIn && user ? (
          <div className="user-info">
           <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
           {user.picture ? (
                <img src={user.picture} alt="User" className="profile-img" />
              ) : (
                <div className="profile-letter">{user.name.charAt(0).toUpperCase()}</div>
              )}
            </div>

            {showDropdown && (
              <div className="dropdown">
                <p>{user.email}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <SignIn setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </div>
    </div>
  );
}
export default Header;
