const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sendMailRoute = require('./sendMailRoute');
// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api', sendMailRoute);

// Root Route
app.get("/", (req, res) => {
  res.send("Hotel Booking Server is Running...");
});

// API Route to Send Push Notification
app.post("/send-notification", async (req, res) => {
  const { deviceToken, title, body } = req.body;
  if (!deviceToken || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const message = {
    notification: { title, body },
    token: deviceToken,
  };
  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    res.status(200).json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
