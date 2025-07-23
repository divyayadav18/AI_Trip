// client/src/utils/api.js

export const bookHotel = async (bookingData) => {
    const response = await fetch("http://localhost:5000/api/book-hotel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    return await response.json();
  };
  
  export const sendNotification = async ({ deviceToken, title, body }) => {
    const response = await fetch("http://localhost:5000/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceToken, title, body }),
    });
    return await response.json();
  };
  