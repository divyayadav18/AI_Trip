import React, { useEffect } from 'react'
import './infoSect.css'
function InfoSection({trip}) {
  return (
    <div className='info-section'>
        <img src='/travel.jpg'/>
        <div>
            <h2>{trip?.userSelection?.location}</h2>
            <div className='trip-info'>
                <h2>{trip?.userSelection?.noOfDays} Days Trip🗓️</h2>
                <h2>Your Budget: {trip?.userSelection?.budget}💰</h2>
                <h2>No. Of Traveler: {trip?.userSelection?.traveler}🧑🏻‍🤝‍🧑🏽</h2>
              {/*  <button><FaShareAlt /></button>*/}
            </div>
        </div>    
    </div>
  )
}
export default InfoSection