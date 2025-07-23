const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const router = express.Router();

//const OWNER_EMAIL = "tripplan25@gmail.com";
router.post('/send-booking-email', async (req, res) => {
  const {
    hotelName,
    checkIn,
    checkOut,
    amount,
    paymentMode,
    email,
    phone,
    Name,
    Address
  } = req.body;
  console.log('Received booking details:', req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Owner email
        pass: process.env.App_Password, // App password generated from Google
      },
    });
    const mailOptions = {
      from: '"Trip Booking System" <tripplan25@gmail.com>',
      to: [email],
      subject: '📩 New Trip Booking Received!',
      html: `
        <h2>New Trip Booking Details</h2>
        <ul> 
          <li><strong>Hotel:</strong> ${hotelName}</li>
          <li><strong>Address:</strong> ${Address || "Not known"}</li>
          <li><strong>Name:</strong> ${Name || "N/A"}</li>
          <li><strong>Check-In:</strong> ${checkIn}</li>
          <li><strong>Check-Out:</strong> ${checkOut}</li>
          <li><strong>Amount:</strong> ₹${amount}</li>
          <li><strong>Payment Mode:</strong> ${paymentMode}</li>
          <li><strong>Customer Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Email failed:', error);
    res.status(500).json({ error: error.message });
  }
});
/*for cancel email*/
router.post('/send-cancellation-email', async (req, res) => {
  const {
    hotelName,
    checkIn,
    checkOut,
    amount,
    paymentMode,
    email,
    phone,
    Name,
    Address,
    hotelAdd
  } = req.body;
  console.log('Received cancellation details:', req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.EMAIL_USER, // Owner email
        pass: process.env.App_Password,
       
      },
    });

    const mailOptions = {
      from: '"Trip Booking System" <tripplan25@gmail.com>',
      to: [email],
      subject: 'Trip Booking Cancelled by You',
      html: `
        <h2>Your Booking Has Been Cancelled by you.......</h2>
        <p>This is to confirm that you have cancelled your booking.</p>
        <ul>
          <li><strong>Hotel:</strong> ${hotelName}</li>
          <li><strong>Address:</strong> ${Address || hotelAdd|| "Not known"}</li>
          <li><strong>Name:</strong> ${Name || "N/A"}</li>
          <li><strong>Check-In:</strong> ${checkIn}</li>
          <li><strong>Check-Out:</strong> ${checkOut}</li>
          <li><strong>Amount:</strong> ₹${amount}</li>
          <li><strong>Payment Mode:</strong> ${paymentMode}</li>
          <li><strong>Customer Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Cancellation Email sent:', info.response);
    res.status(200).json({ message: 'Cancellation email sent successfully' });
  } catch (error) {
    console.error('❌ Cancellation email failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
