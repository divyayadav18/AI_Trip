import React, { useState, useEffect } from "react";
import './Countdown.css';
const travelTips = [
  "Pack light, but don't forget the essentials!",
  "Make sure you have all your travel documents ready.",
  "Stay hydrated during your trip.",
  "Always keep a power bank for your devices.",
  "Research the best local restaurants before you go."
];
const TripCountdown = ({ checkInDate,setModalOpen }) => {
  const [countdown, setCountdown] = useState("");
  const [todayTip, setTodayTip] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = new Date(checkInDate);
    const interval = setInterval(() => {
      const now = new Date();
      const diffTime = targetDate - now;
      if (diffTime <= 0) {
        clearInterval(interval);
        setCountdown("Your trip has arrived!");
      } else {
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const tipIndex = diffDays % travelTips.length;
        setTodayTip(travelTips[tipIndex]);
      }
    }, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [checkInDate]);
  return (  
    <div className="trip-countdown-container">
      <h2 className="trip-title">Your Trip Countdown</h2>
      <p className="trip-time-left">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </p>
      <p className="trip-tip-label">🌟 Tip of the Day:</p>
      <p className="trip-tip">{todayTip}</p></div>
  );
};
export default TripCountdown;
