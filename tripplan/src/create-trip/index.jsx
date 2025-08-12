
{/* Page for giving preferences */}
import { useState, useEffect } from 'react';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '../constants/options';
import { chatSession } from '../service/AIModal';
import { GoogleLogin } from '@react-oauth/google';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './trip.css';





function CreateTrip({isLoggedIn,setIsLoggedIn,setUser}){
  useEffect(() => {
    if (typeof setUser !== 'function') {
      console.error("❌ setUser is NOT a function in CreateTrip!");
    }
  }, [setUser]);
  const [formData, setFormData] = useState({ location: '', noOfDays: '', budget: '', traveler: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("Please sign in to generate your trip");
  const [isLoading, setIsLoading] = useState(false);

  const RAPID_API_KEY = import.meta.env.VITE_LOCATION_KEY;
  const navigate = useNavigate();
  const backgroundImages = [
    "https://hblimg.mmtcdn.com/content/hubble/img/mumbai/mmt/activities/m_activities_mumbai_gateway_of_india_l_472_766.jpg",
    "https://www.holidify.com/images/bgImages/INDIA.jpg",
    "https://travelogyindia.b-cdn.net/blog/wp-content/uploads/2014/02/delhi.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6-7PZajsImAMAv1IhP5GUoNFS4-lrby4mIg&s",
    "https://c.myholidays.com/blog/blog/content/images/2020/11/Rajasthan.webp",
    "https://travelogyindia.b-cdn.net/blog/wp-content/uploads/2016/09/Photography-in-Ladakh.jpg",
    "https://travelogyindia.b-cdn.net/blog/wp-content/uploads/2019/09/Darjeeling-Himalayan-Railway-Toy-Train.jpg",
    "https://travelogyindia.b-cdn.net/blog/wp-content/uploads/2018/12/Kasol-Himachal-Pradesh.jpg",
    "https://travelogyindia.b-cdn.net/blog/wp-content/uploads/2018/12/Khajjiar-Himachal.jpg",
    "https://travelogyindia.b-cdn.net/blog/wp-content/uploads/2014/02/Kanyakumari.jpg",
    "https://www.godigit.com/content/dam/godigit/directportal/en/contenthm/best-places-to-visit-in-india.jpg",
    "https://images.news18.com/ibnlive/uploads/2021/09/hawa-mahal-16326642244x3.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZRWpUNQRJFC85VpJ8xsFc_Du6oLOF0qegvA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM5GPx8WdacQPxyF3z4BXj9PwVmoQIlpEVwg&s",
    "https://ds393qgzrxwzn.cloudfront.net/resize/m600x500/cat1/img/images/0/k8KcGmXU2H.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJj__5FhigmsOiSOt0TpWvfO1THnUXX0X65g&s",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    },3000); // change every 3 seconds
    return () => clearInterval(interval);
  }, []);
 useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    setUser(storedUser);
    setIsLoggedIn(true);
    setShowModal(false);
  } else {
    setIsLoggedIn(false);
    console.log("No user found in localStorage.");
  }
}, [setIsLoggedIn, setUser]);

const handleLoginSuccess = (response) => {
  const decodedUser = jwtDecode(response.credential); // Decode token
  const userData = {
    name: decodedUser.name,
    email: decodedUser.email,
    picture: decodedUser.picture, // Profile image URL
  };

  localStorage.setItem("user", JSON.stringify(userData)); // Save in localStorage
  setUser(userData);
  setIsLoggedIn(true);
  setShowModal(false);
};
  const handleLoginFailure = () => {
    console.error("Login Failed");
  };
  const fetchPlaces = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    const url = `https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&components=country:IN&language=en`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPID_API_KEY,
          "X-RapidAPI-Host": "google-map-places.p.rapidapi.com",
        },
      });
      const data = await response.json();
      if (data.status === "OK" && Array.isArray(data.predictions)) {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setSuggestions([]);
    }
  };
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (name === "location") {
      fetchPlaces(value);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    const selectedLocation = `${suggestion.structured_formatting.main_text}, ${suggestion.structured_formatting.secondary_text}`;
    setFormData((prev) => ({ ...prev, location: selectedLocation })); 
    setSuggestions([]); 
    setTimeout(() => {
      document.querySelector("input[name='location']").value = selectedLocation;
    }, 0);
  };
  const validateForm = () => {
    return formData.location && formData.noOfDays && formData.budget && formData.traveler;
  };
  const handleGenerateTrip = async () => {
    if (!isLoggedIn) {
      console.log("User is not logged in. Showing sign-in modal...");
      setModalMessage("Please sign in to generate your trip");
      setShowModal(true);
      return;
    }
    if (!validateForm()) {
      setModalMessage("Please fill all details");
      setShowModal(true);
      return;
    }
    try {
    setIsLoading(true); // START loading
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);
      console.log("Generating AI trip with data:", FINAL_PROMPT);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result?.response?.text());
      if (result?.response?.text()) {
        SaveAiTrip(result.response.text());
      }
    } catch (error) {
      console.error("Error generating trip:", error);
    } finally {
    setIsLoading(false); // STOP loading
  }
  };
  const SaveAiTrip = async (TripData) => {
    try {  
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        id: docId
      });
       setFormData({
      location: "",
      noOfDays: "",
      budget: "",
      traveler: ""
    });
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };
  return (
    <div className="bg">
      <div className="location">
        <div className="slideshow">
          {backgroundImages.map((img,index)=>(
            <img key={index} src={img} alt={`Slide ${index}`} className={`slide ${index === currentSlide ? "active" : ""}`} />
          ))}
        </div>
        <h2 className="heading-pref">Tell us your travel preference</h2>
        <p className="subheading">
          Provide some basic information and our trip planner will generate a customized itinerary based on your preferences.
        </p>

        {!isLoggedIn && (
          <div className="modal">
            <div className="modal-content">
              <p>{modalMessage}</p>
            {/*  <GoogleLogin onSuccess={handleLoginSuccess} onFailure={handleLoginFailure} /> */}
            <GoogleLogin
               onSuccess={(credentialResponse) => {
                 handleLoginSuccess(credentialResponse);
                 setShowModal(false);
               }}
               onError={handleLoginFailure}
/>
            </div>
          </div>
        )}
        {!showModal && (
          <>
            <div className="section">
              <h2 className="destination">Where is your destination?</h2>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                placeholder="Search for an Indian city"
                disabled={isLoading}
                autoComplete="new-password"
              />
              {suggestions.length > 0 && isInputFocused && (
                <div className="suggestions-container">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      onMouseDown={() =>!isLoading && handleSuggestionClick(suggestion)}  
                      className="suggestion-item"
                    >
                      {suggestion.structured_formatting.main_text}, {suggestion.structured_formatting.secondary_text}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="gap2">
              <h2 className="days">How many days are you staying?</h2>
              <input
                type="text"
                name="noOfDays"
                value={formData.noOfDays}
                onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                placeholder="Type days..."
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            <div>
              <h2 className="budget">What is your Budget?</h2>
              <div className="boxes1">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => !isLoading && handleInputChange("budget", item.title)}
                    className={`p-4 border rounded-lg hover:shadow-lg ${formData.budget === item.title && "shadow-lg border-black"}`}
                  >
                    <h2 className="icon">{item.icon}</h2>
                    <h2 className="people">{item.people}</h2>
                    <h2 className="desc">{item.desc}</h2>
                    
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="planof">Who do you plan to travel with?</h2>
              <div className="gap3">
                {SelectTravelesList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => !isLoading && handleInputChange("traveler", item.people)}
                    className={`p-4 border rounded-lg hover:shadow-lg ${formData.traveler === item.people && "shadow-lg border-black"}`}>
                    <h2 className="icon">{item.icon}</h2>
                    <h2 className="title">{item.title}</h2>
                    <h2 className="desc">{item.desc}</h2>
                  </div>
                ))}
              </div>
            </div>
            <div className="gentrip">
            {isLoading ? (
                <div className="loading-spinner"></div>
                 ) : (
    
  
              <button onClick={handleGenerateTrip}>Generate Trip</button>
                 )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default CreateTrip;








