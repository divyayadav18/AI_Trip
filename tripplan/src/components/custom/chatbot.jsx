// ChatBot.jsx
import React, { useState } from 'react';
import './chatbot.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(`Give a short and summarized chat like answer to my question regarding travelling in India only with proper chat feeling to user questions: ${input}`);
      const response = await result.response;
      const text = response.text();
      const botMessage = { sender: 'bot', text: text || "Sorry, I didn't understand that." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error getting response from Gemini.' }]);
    }
  };
  return (
    <div className="chatbot-wrapper">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>💬</button>
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Chat with me....."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ChatBot;
