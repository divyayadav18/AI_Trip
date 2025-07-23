import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Hotel.css'
function Hotels({ trip }) {
  const navigate=useNavigate();
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Get the number of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
    // Create an array for full stars (only if fullStars > 0)
    const stars = Array.from({ length: fullStars }, (_, i) => (
      <span key={`full-${i}`} role="img" aria-label="full-star">🌕</span>
    ));
    if (hasHalfStar) {
      stars.push(
        <span key="half-star" role="img" aria-label="half-star">🌗</span>
      );
    }
    return stars;
  }; 
  return (
    <div>
      <h2 className='headings'>A comfortable stay is the foundation of a successful trip🏨🏨....</h2>
<div className='small-images'>
    {trip?.tripData?.hotels?.map((item, index) => (
        <div key={index} className="hotel-card"> {/* Wrap everything inside a div */}
            <Link 
                to={'https://www.google.com/maps/search/?api=1&query=' + item["Hotel Name"] + "," + item["Hotel Address"]} 
                target='_blank'
                className="hotel-info">
                <h2>{item["Hotel Name"]}</h2>
                <h2 className='hotel-address'>📍 {item["Hotel Address"]}</h2> 
                {/* Check if the price is an object and handle it accordingly */}
                <h2 className='price'>💰{item["Price per night"]}💸💸</h2>
                <h2 className='ratings'>Ratings {renderStars(item?.Ratings)}{item?.Ratings} stars</h2> 
            </Link>
            {/* ✅ Check Availability Button Inside Hotel Card */}
            <button 
                className='check-btn' 
                onClick={() => {
                  console.log("Navigate to check availability jsx",item["Hotel Name"]);
                  console.log("passing price per night :",item["Price per night"]);
                  console.log("passing address:",item["Hotel Address"]);
                  navigate(`/check-availability/${encodeURIComponent(item["Hotel Name"])}`,{
                    state:{hotelName:item["Hotel Name"],
                           pricePerNight:item["Price per night"],
                           hotelAdd:item["Hotel Address"] !== "N/A" ? item["Hotel Address"] : "Address not available",
                    }
                  });}} >
                Check Availability
            </button>
        </div>
    ))}</div>  </div>
  )
}
export default Hotels
