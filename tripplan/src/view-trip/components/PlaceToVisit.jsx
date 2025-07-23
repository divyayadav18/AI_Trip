import React from 'react';
import './placeTovisit.css';
function PlaceToVisit({ trip }) {
  if (!trip || !trip.tripData || !trip.tripData.itinerary || Object.keys(trip.tripData.itinerary).length === 0) {
    return <div>No places to visit available.</div>;
  }
  const allPlaces = Object.values(trip.tripData.itinerary)
  .flat()
  .filter(place => place && place.placeName); // Filter out empty or undefined places
return (
  <div className="places-container">
    <h2 className="section-title">Places to Visit</h2>
    <div className="places-scroll-container">
      {allPlaces.length > 0 ? (
        allPlaces.map((place, index) => (
          <div key={index} className="place-card">
            <div className="place-details">
              <h3 className="place-name">{place.placeName}</h3>
              <p><strong>Best Time:</strong> {place["Best time to visit"] || "N/A"}</p>
              <p><strong>Details:</strong> {place["Place Details"] || "No details available"}</p>
              <p><strong>Ticket:</strong> {place["Ticket pricing"] || "Not available"}</p>
              <p><strong>Travel Info:</strong> {place["Time to travel"] || "Not available"}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No places to visit available.</p>
      )}
    </div>
  </div>
);}
export default PlaceToVisit;
