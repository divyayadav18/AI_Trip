import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CheckAvl.css";
const CheckAvailability = () => {
  const { hotelId } = useParams();
  const location =useLocation();
  const hotelName=location.state?.hotelName || "Hotel";
  const pricePerNight=location.state?.pricePerNight || 'N/A';
  const hotelAdd=location.state?.hotelAdd || 'N/A';
  console.log("Hotel ID:",hotelId);
  console.log("Hotel Name:",hotelName)
  console.log("Price per night:",pricePerNight);
  console.log("Hotel Address:",hotelAdd);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [availability, setAvailability] = useState(null);
  const [isAvailable, setIsAvailable]=useState(false);
  const navigate=useNavigate();
  const checkAvailability = async () => {
    try {
      // Ensure hotelId is a string and properly formatted
      const formattedHotelId = encodeURIComponent(hotelId); 
      const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/getHotelDetails?id=${formattedHotelId}&checkIn=${checkIn}&checkOut=${checkOut}&currency=USD`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_CHECK_DETAILS_API,
          "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
        }
      });
      const data = await response.json();
      if (data.status) {
        setAvailability("✅ Rooms Available");
        setIsAvailable(true);
      } else {
        setAvailability("❌ No Rooms Available");
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Error checking availability", error);
      setAvailability("❌ Error checking availability");
    }
  };
  return (
    <div className="availability-page">
      <div className="availability-container">
        <h2>Check Availability at {hotelName}</h2>
        <label>Check-in Date:</label>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        <label>Check-out Date:</label>
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        <button className="check-btn" onClick={checkAvailability}>Check Availability</button>
        {availability && <p>{availability}</p>}
        {isAvailable && (
          <button className="book-now-btn" onClick={()=> {
            console.log("Navigating to book hotel:",{hotelId,hotelName,checkIn,checkOut,pricePerNight});
            navigate(`/book-hotel/${hotelId}`,{
             state:{checkIn,checkOut,hotelName,pricePerNight,hotelId,hotelAdd}, // passing value to next page
          });}}>
            Book Now
          </button>
        )}</div>
    </div>
  );
};
export default CheckAvailability;