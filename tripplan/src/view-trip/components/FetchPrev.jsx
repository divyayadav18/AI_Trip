import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../service/firebaseConfig";
import "./FetchPrev.css";
const FetchPrevious = ({ userEmail }) => {
  const [previousBookings, setPreviousBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!userEmail) return;
    const sanitizedEmail = userEmail.replace(/[@.]/g, "_"); // Ensure valid Firestore collection name
    const fetchBookings = async () => {
        try {
            console.log("🔄 Fetching bookings for:", sanitizedEmail);
            const querySnapshot = await getDocs(collection(db, sanitizedEmail));
            const bookingsData = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              const normalizedData=data.user ? data.user : data;
              return {...normalizedData,
                id:doc.id,
              };
            });
            setPreviousBookings(bookingsData);
          } catch (error) {
            console.error("❌ Error fetching previous bookings:", error.message);
          }
        };
        fetchBookings();
      }, [userEmail]); 
      const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
      };
      const confirmCancellation = async () => {
        if (!selectedBooking || !selectedBooking.id) {
          alert("Something went wrong. Please try again.");
          return;
        }
        const sanitizedEmail = userEmail.replace(/[@.]/g, "_");
        try {
          await deleteDoc(doc(db, sanitizedEmail, selectedBooking.id));
          setPreviousBookings((prev) =>
            prev.filter((booking) => booking.id !== selectedBooking.id)
          );
           const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-cancellation-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hotelName: selectedBooking.hotelName,
              Address: selectedBooking.hotelAdd,
              Name: `${selectedBooking.firstName || ""} ${selectedBooking.lastName || ""}`,
              checkIn: selectedBooking.checkIn,
              checkOut: selectedBooking.checkOut,
              amount: selectedBooking.amount || selectedBooking.price,
              paymentMode: selectedBooking.paymentMode || "N/A",
              email: selectedBooking.email || userEmail,
              phone: selectedBooking.phone || "N/A",
            }),
          });
          const result = await response.json();
  if (!response.ok) {
    console.error("❌ Email failed with status:", response.status);
  }
        } catch (error) {
          console.error("❌ Error cancelling booking:", error.message);
          alert("Failed to cancel the booking.");
        } finally {
          setShowModal(false);
          setSelectedBooking(null);
        }
      };
      const isBeforeTwoDays = (checkIn) => {
        const today = new Date();
        const checkInDate = new Date(checkIn);
        const twoDaysBefore = new Date(checkInDate);
        twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
        return today <= twoDaysBefore;
      };
  return (
    <div className="previous-bookings-container">
      <h2 className="previous-heading">Previous Bookings</h2>
      <div className="bookings-list">
        {previousBookings.length === 0 ? (
          <p>No previous bookings.</p>
        ) : (
          <div className="scroll-container">
            <div className="scroll-content">
              {[...previousBookings].reverse().map((booking, index) => (
                <div key={index} className="previous-booking">
                  <p><strong>Hotel:</strong> {booking.hotelName || "N/A"}</p>
                  <p><strong>Name:</strong> {booking.firstName || ""}{" "}
                    {booking.lastName || "N/A"}</p>
                  <p><strong>Check-in:</strong> {booking.checkIn || "N/A"}</p>
                  <p><strong>Check-out:</strong> {booking.checkOut || "N/A"}</p>
                  <p><strong>Price:</strong> ₹{booking.amount  || booking.price }</p>
                  <p><strong>Payment Mode:</strong> {booking.paymentMode  ||  "N/A"}</p>
                  {isBeforeTwoDays(booking.checkIn) && (
                    <button className="cancel-button" onClick={() => handleCancelClick(booking)}>Cancel</button>
                  )}</div>
              ))}</div> </div>
        )}</div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>❗ Confirm Cancellation</h3>
            <p>Are you sure you want to cancel your booking at <strong>{selectedBooking.hotelName}</strong>?</p>
            <div className="modal-buttons">
              <button onClick={confirmCancellation} className="confirm-btn">Yes, Cancel</button>
              <button onClick={() => setShowModal(false)} className="close-btn">No, Go Back</button> </div></div>
        </div>
      )}</div>
  );
};
export default FetchPrevious;

