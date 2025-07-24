import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../service/firebaseConfig';
import TripCountdown from './Countdown';
const Payment = ({ bookingDetails,userEmail,setModalOpen }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const sanitizedEmail = userEmail.replace(/[@.]/g, "_"); // Convert to valid Firestore collection name

  const handlePayment = async () => {
    if(isPaymentProcessing) return;
    setIsPaymentProcessing(true);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_TEST_KEY_ID, 
     amount: Number(bookingDetails.price) * 100,
      currency: 'INR',
      name: 'Hotel Payment',
      description: `Payment for ₹${bookingDetails.hotelName}`,
      image: 'https://your-logo-url.com/logo.png', 
      handler: async (response) => {
        console.log('Payment Successful:', response);
        await savePayment(response.razorpay_payment_id, bookingDetails.price);
        setPaymentSuccess(true);
        setIsPaymentProcessing(false);
      },
      prefill: {
        name: `${bookingDetails.firstName} ${bookingDetails.lastName}`,
        email: bookingDetails.email,
        contact: bookingDetails.phone
      },
      theme: {
        color: '#3399cc',
      },
      method: {
        upi: true, // Enable UPI payment only
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  const savePayment = async (paymentId, amount) => {
    if (!userEmail) {
      console.error("User email is missing. Cannot save payment.");
      alert("Error: User email is required to save payment.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, sanitizedEmail), { 
        user: {
          firstName: bookingDetails.firstName,
          lastName: bookingDetails.lastName,
          email: bookingDetails.email,
          phone: bookingDetails.phone,
          paymentId,
        paymentMode: 'Online',
        amount,
        date: new Date().toISOString(),
        hotelName: bookingDetails.hotelName,
        hotelAddress:bookingDetails.hotelAdd,
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
        },     
      });
      setIsEmailSending(true); // Start showing message
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-booking-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  hotelName: bookingDetails.hotelName,
                  Address: bookingDetails.hotelAdd,
                  Name: `${bookingDetails.firstName} ${bookingDetails.lastName}`,
                  firstName:bookingDetails.firstName,
                  lastName:bookingDetails.lastName,
                  checkIn: bookingDetails.checkIn,
                  checkOut: bookingDetails.checkOut,
                  amount,
                  paymentMode: 'Online',
                  email: bookingDetails.email,
                  phone: bookingDetails.phone,
                }),
              })
                .then((res) => res.json())
                .then((data) => {console.log('📩 Email Sent Result:', data); setIsEmailSending(false);})
                .catch((err) => {console.error('❌ Error Sending Email:', err); setIsEmailSending(false);});
    } catch (error) {
      console.error('❌ Error saving payment:', error.message, error.code);
      alert(`Failed to save payment: ${error.message}`);
    }
  };
  return (
    <div>
    <div className="payment-container">
      <h2>Total Amount: ₹{bookingDetails.price}</h2>
      {!paymentSuccess ? (
        <>
         <button onClick={handlePayment} className="pay-button">
           Pay Now
        </button></>
      ):(
        <>
        {isEmailSending && (
        <p className="sending-email-message">
          📤 Sending booking details to your email...
        </p>
      )}
         <p className="success-message">
        ✅ Payment of ₹{bookingDetails.price} was successful!
      </p>
      <button onClick={() => setShowCountdown(true)} className="cancel-button">
        Cancel
      </button></>
  )}</div>
     {showCountdown && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Your Trip Countdown</h2>
          <TripCountdown checkInDate={bookingDetails.checkIn} />
          <button
            className="close-button"
            onClick={() => {
              setShowCountdown(false);
              setModalOpen(false); 
            }}>
            Close Countdown
          </button></div></div>
    )}</div>
  );
};
export default Payment;





