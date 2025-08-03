{/*Header jsx*/}
import React, { useState, useEffect } from "react";
import './components/custom/Header.css';
import SignIn from "./SignIn";
import ChatBot from "./chatbot";


function Header({ isLoggedIn,setIsLoggedIn,setUser,user}){
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogin = (userData) => {
    setUser(userData);  // user email is passed
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");   //This will remove user data
    setIsLoggedIn(false);  // Set login status to false
    setUser(null);
    setShowDropdown(false);
    window.location.reload(false);  
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
