{/*First page of website*/}
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Front.css';
import './components/custom/Front.css';

import { destinations } from './DestOpt';
import WeatherWidget from './weather';
import Footer from './Footer';

const images = [
  '/fort.jpg',
  '/Khajjiar.jpg',
  '/kalpa-himachal-pradesh.webp',
  '/Jaipur.jpg',
  '/the-lotus-temple.jpg',
  '/photograph-train-rides.jpg',
  '/flowers.jpg',
  '/tea-plantations.jpg',
  '/boats,webp',
  '/mount.jpg',
  '/lakes.jpg',
]

function Hero() {
  const [currentIndex,setCurrentIndex]=useState(0);
  useEffect(()=>{
    const interval=setInterval(()=>{
      setCurrentIndex((prevIndex)=>(prevIndex+1)% destinations.length);

    },2000);
    return()=> clearInterval(interval);
  },[]);
  return (
   <div className='trip-container'>
    <div className='discover'>
       <div className='slideshow-background'>
          <img
            src={images[currentIndex]}
            alt='Slideshow'
            className='background-image'
          />
        
        {/* Content on top of the video */}
        <div className="content">
          <h1 className="heading">
            <span>The most beautiful in the world is, Ofcourse, the world itself. </span>
            Let's plan the trip of your dreams &amp; create memories you will want to revisit.
          </h1>
          <p className="para">Your personalized travel is here, and you can manage it by yourself.</p>
      <Link to={'/create-trip'}>
       <button className='button-get'>Get started</button>
      </Link>
    </div>
    </div>
    </div>

      {/* Destinations Section (Slideshow & Side Cards) */}
      <div className="trip-planner">
        {/* Main Image Slideshow */}
        <div className="featured-destination">
          <img
            src={destinations[currentIndex].image}
            alt="Travel"
            className="destination-image"
          />
          <div className="overlay">
            <h2>{destinations[currentIndex].title}</h2>
            <p>{destinations[currentIndex].description}</p>
          </div>
        </div>
        
        {/* Right Side Cards */}
        <div className="side-cards">
          <div className="card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5dPWJl0-gsCJkFZ6i4T9sOIH91JBYqh36Pg&s" alt="Wanderlust" />
            <span>— Wanderlust</span>
            <h3>"Travel is the only thing you buy that makes you richer."</h3>
            <p>Explore new places, create unforgettable experiences.</p>
          </div>
          <div className="card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOaB8IwIiKBqoqqh7k21CuI2SHa2enUwkwBQ&s" alt="Adventure" />
            <span>— Adventure</span>
            <h3>"Jobs fill your pockets, but adventures fill your soul."</h3>
            <p>Find your next adventure and embrace the unknown.</p>
          </div>
        </div>
      </div>
      <WeatherWidget/>
      <Footer/>
    </div>
    
  )
}
export default Hero