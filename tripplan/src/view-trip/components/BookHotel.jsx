import React, { useEffect, useState } from "react";
import "./BookHotel.css"; // External CSS file
import { addDoc, collection, doc, getDoc, getDocs, setDoc, where } from "firebase/firestore";
import { auth, db } from "../../service/firebaseConfig";
import { useLocation } from "react-router-dom";
import Footer from "../../components/custom/Footer";
import Payment from "./Payment";
import FetchPrevious from "./FetchPrev";
import TripCountdown from "./Countdown";
const HotelDetail = ({  hotel = {} ,user,isLoggedIn}) => {
  const location = useLocation();
  const {checkIn,checkOut,hotelName,pricePerNight,hotelAdd}=location.state || {};
  const[userEmail,setUserEmail]=useState("");
  const [isEmailSending, setIsEmailSending] = useState(false);

  let minPrice = 0, maxPrice = 0;
if (pricePerNight && typeof pricePerNight === "string") {
  const priceMatches = pricePerNight.match(/₹?([\d,]+)/g);
  if (priceMatches && priceMatches.length >= 2) {
    minPrice = parseInt(priceMatches[0].replace(/[^0-9]/g, ''), 10);
    maxPrice = parseInt(priceMatches[1].replace(/[^0-9]/g, ''), 10);
  }
}
  const checkInDate=new Date(checkIn);
  const checkOutDate=new Date(checkOut)
  const timeDiff=checkOutDate.getTime()-checkInDate.getTime();
  const nights=Math.max(timeDiff/(1000*3600*24),1);
  const [roomSelection, setRoomSelection] = useState("1"); // Default: 1 room
  const totalPrice = roomSelection === "1" ? minPrice * nights : maxPrice * nights;
  const [modalOpen,setModalOpen]=useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const[showPayment,setShowPayment]=useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: checkIn || "",
    checkOut: checkOut || "",
    feedback: "",
    hotelName: hotelName || "Hotel",
    price: totalPrice,
    hotelAdd:hotelAdd || "Address",
  });
  const[previousBookings,setPreviousBookings]=useState([]);
  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };
  const handleRoomSelection = (e) => {
    setRoomSelection(e.target.value);
    setBookingDetails((prev) => ({
      ...prev,
      price: e.target.value === "1" ? minPrice * nights : maxPrice * nights,
    }));
  };
  const handleBooking = async () => { 
    if (!isLoggedIn || !user) {
      alert("You must be logged in.");
      return;
    }
    if (!userEmail) {
      console.error("Error: userEmail is empty, cannot store booking.");
      return;
  }
    if (!bookingDetails.firstName || !bookingDetails.lastName || !bookingDetails.email || !bookingDetails.phone || !bookingDetails.checkIn || !bookingDetails.checkOut) {
      alert("All fields except feedback are mandatory!");
      return;
    }
    try{
    const sanitizedEmail = userEmail.replace(/[@.]/g, "_"); 
      // Open the modal after successful booking
      setModalOpen(true);
    } catch (error) {
      console.error("Error storing booking: ", error);
      alert("Booking failed. Please try again.");
    }
  };
  useEffect(()=>{
    if (user && user.email) {
      const sanitizedEmail = user.email.replace(/[@.]/g, "_");
      console.log("Sanitized Email:", sanitizedEmail);
      setUserEmail(sanitizedEmail);
      fetchBookings(sanitizedEmail);
    }
  }, [user]);
  const fetchBookings = async (email) => {
    if (!email) return;
    console.log("Fetching bookings for email:", email);
    try {
      const q=query(collection(db,"email"),where("email","==",email));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map((doc) => doc.data());
      setPreviousBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  const saveBookingToFirebase = async () => {
    try {
      const sanitizedEmail = userEmail.replace(/[@.]/g, "_");
      await addDoc(collection(db, sanitizedEmail), {
        ...bookingDetails,
        paymentMode: "On Property",
        timestamp: new Date(),
      });
       setIsEmailSending(true);
      console.log("Pay on prop.Booking confirmed successfully in Firebase.");
      console.log("Sending booking details:", bookingDetails);

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-booking-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelName: bookingDetails.hotelName,
          Address: bookingDetails.hotelAdd,
          firstName:bookingDetails.firstName,
          lastName:bookingDetails.lastName,
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
          amount: bookingDetails.price,
          paymentMode: 'On Property',
          email: bookingDetails.email,
          phone: bookingDetails.phone,
        }),
      })
        .then((res) => res.json())
        .then((data) => {console.log('📩 Email Sent Result:', data); setIsEmailSending(false); setShowThankYou(true); } )
        .catch((err) => {console.error('❌ Error Sending Email:', err); setIsEmailSending(false);});
     
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };
  const handleModalClose = () => {
    // Close the current modal and show the countdown
    setModalOpen(false); 
    setShowCountdown(true); // Show countdown modal after closing
  };
  return (
   <div className="whole-page">
    <div className="hotel-booking-wrapper">
      <div className="image-slider-container">
        <div className="image-slider">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRws0lSX6f4ElcSdSopnlMOkv02fjJCZgWhNdmnbS1UTxbAkKfDsN1di-UAPCMtTjGHg7w&usqp=CAU" className="slider-image"  />
          <img src="https://static.toiimg.com/photo/msid-89433382,width-96,height-65.cms" className="slider-image"  />
          <img src="https://www.planetware.com/wpimages/2020/01/india-in-pictures-beautiful-places-to-photograph-gateway-of-india-mumbai.jpg" className="slider-image"  />
          <img src="https://static2.tripoto.com/media/filter/tst/img/576522/TripDocument/1521402186_1.jpg" className="slider-image"  />
          <img src="https://static-blog.treebo.com/blog/wp-content/uploads/2018/06/manali.jpg" className="slider-image"  />
          <img src="https://ihplb.b-cdn.net/wp-content/uploads/2018/06/Qutub-Minar.jpg" className="slider-image"  />
          <img src="https://adventuresome.in/wp-content/uploads/2020/04/Top-most-places-to-visit-in-India-min.jpg" className="slider-image"  />
          <img src="https://www.holidify.com/images/cmsuploads/compressed/darjeeling_ropeway_1024_20180315132526.jpg" className="slider-image"  />
          <img src="https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_Shimla_main_tv_destination_img_1_l_596_907.jpg" className="slider-image"  />
          <img src="https://static.toiimg.com/thumb/msid-92089121,width-748,height-499,resizemode=4,imgsize-139308/Most-beautiful-places-to-visit-in-India-for-first-timers.jpg" className="slider-image"  />
        </div> </div>
    <div className="hotel-booking-container">
    <div className="welcome-box">
     <div className="welcome-text">
      <h2 className="booking-title">{hotelName} WELCOMES YOU!</h2>
      <p className="hotel-address-center">{hotelAdd}</p></div></div>
      <div className="booking-form">
        <input type="text" name="firstName" placeholder="First Name" value={bookingDetails.firstName} onChange={handleChange} className="booking-input" required />
        <input type="text" name="lastName" placeholder="Last Name" value={bookingDetails.lastName} onChange={handleChange} className="booking-input" required />
        <input type="email" name="email" placeholder="Email" value={bookingDetails.email} onChange={handleChange} className="booking-input" required />
        <input type="tel" name="phone" placeholder="Phone Number" value={bookingDetails.phone} onChange={handleChange} className="booking-input" required />
        <input
  type="date"
  name="checkIn"
  value={bookingDetails.checkIn}
  readOnly
  className="booking-input no-calendar"
/>
<input
  type="date"
  name="checkOut"
  value={bookingDetails.checkOut}
  readOnly
  className="booking-input no-calendar"
/>
        <textarea name="feedback" placeholder="Feedback (Optional)" value={bookingDetails.feedback} onChange={handleChange} className="booking-input"></textarea>
      </div> 
      <h4>Select Room:</h4>
          <div className="room-selection">
            <label>
              <input type="radio" name="room" value="1" checked={roomSelection === "1"} onChange={handleRoomSelection} />
              1 Room
            </label>
            <label>
              <input type="radio" name="room" value="2" checked={roomSelection === "2"} onChange={handleRoomSelection} />
              2 Rooms
            </label>
          </div>
      <h3 className="booking-price">Total Price: ₹{totalPrice}</h3>
      <button onClick={handleBooking} className="booking-button">Confirm Booking</button>  </div>
    {modalOpen && (
        <div className="modal-overlay">
      <div className="modal-content"> 
        {isEmailSending ? (
  <p className="sending-email-message">
    📤 Sending booking details to your email...
  </p>
) : showThankYou ? (
          <>
            <h2>Enjoy Your Day!</h2>
            <p>We will proceed with your trip further and send your confirmed booking to your phone number.</p>
            <h3>Trip Details</h3>
            <p><strong>Hotel:</strong> {bookingDetails.hotelName}</p>
            <p><strong>Check-in:</strong> {bookingDetails.checkIn}</p>
            <p><strong>Check-out:</strong> {bookingDetails.checkOut}</p>
            <p><strong>Price:</strong> {bookingDetails.price}</p>
            <button className="close-button" onClick={handleModalClose}>Close</button>
          </>
        ) : showPayment ? (
          <>
          <Payment bookingDetails={bookingDetails} userEmail={userEmail} setModalOpen={setModalOpen} /></>
        ) : (
          <>
            <h2>Proceed your journey by paying</h2>
            <p>Click on your suitable button:</p>
            <button className="pay-button" onClick={saveBookingToFirebase}>
              Pay on Property
            </button>
            <button className="pay-button" onClick={() => {
             setShowPayment(true);
            }}>
              Pay Us
            </button>
            <button className="close-button" onClick={() => setModalOpen(false)}>
              Close
            </button> </>
        )}</div></div>
      )}
      {showCountdown && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Your Trip Countdown</h2>
            <TripCountdown checkInDate={bookingDetails.checkIn} />
            <button className="close-button" onClick={() => setShowCountdown(false)}>Close Countdown</button>
          </div>
        </div>
)}
    <FetchPrevious userEmail={userEmail}/></div></div>
);
};
export default HotelDetail;

