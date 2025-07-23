import { useState } from "react";
import { motion } from "framer-motion";
import "./Quotes.css";

const quotes = [
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Travel makes one modest. You see what a tiny place you occupy in the world.",
    author: "Gustave Flaubert"
  },
  {
    text: "Life is short and the world is wide.",
    author: "Simon Raven"
  },
  {
    text: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien"
  },
  {
    text: "Wherever you go becomes a part of you somehow.",
    author: "Anita Desai"
  }
];

export default function QuotesSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="quotes-wrapper">
      <div className="quotes-container">
        <h2 className="quotes-title">Inspirational Quotes</h2>
        <motion.div 
          className="quotes-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              className="quote-card"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.p 
                className="quote-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                "{quote.text}"
              </motion.p>
              <p className="quote-author">- {quote.author}</p>
              {hovered === index && (
                <motion.div
                  className="quote-hover-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
