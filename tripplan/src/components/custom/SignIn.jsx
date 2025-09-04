import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";


function SignIn({ setUser,setIsLoggedIn }) {
  const handleLoginSuccess = (response) => {
     console.log("Google login success response:", response);
    const decodedUser = jwtDecode(response.credential);
    console.log("Decoded user data:", decodedUser);

    const userData = {
      name: decodedUser.name,
      email: decodedUser.email,
      picture: decodedUser.picture || null, 
    };
    console.log("Storing user data in sessionStorage:", userData);
    localStorage.setItem("user", JSON.stringify(userData)); 
    localStorage.setItem("isLoggedIn", "true"); 
    setUser(userData);
    setIsLoggedIn(true);
  };
  const handleLoginFailure = () => {
    console.error("Login Failed");
  };
  return (
    <GoogleLogin onSuccess={handleLoginSuccess} onFailure={handleLoginFailure} />
  );
}
export default SignIn;
