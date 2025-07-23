import React from 'react'
  function PlaceCardItem({
    placeName,details,bestTime,timeToTravel}){
      return(
        <div className="place-card">
        <h3>{placeName}</h3>
        <img src={imageUrl} alt={placeName} className="place-image" />
        <p>{details}</p>
        <p><strong>Best time to visit:</strong> {bestTime}</p>
     
        <p className="time-to-travel"><strong>Time to travel:</strong> {timeToTravel}</p>
        <button className="place-card-item-button">More Details</button>
      </div>
      )
    }

export default PlaceCardItem;


