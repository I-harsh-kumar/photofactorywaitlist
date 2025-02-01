import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FaInstagram, FaYoutube, FaFacebook, FaCheckCircle } from 'react-icons/fa';

function LoadingBar() {
  return <div className="loading-bar"></div>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emails, setEmails] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value.trim();
    setEmail(emailValue);

    // Basic email validation (adjust regex as needed)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    setIsEmailValid(emailRegex.test(emailValue)); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isEmailValid) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (emails.includes(email)) {
      setMessage('This email is already on the waitlist.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/subscribe', { email }); 

      if (response.status === 200) {
        setEmails([...emails, email]); 
        setMessage('Thank you for subscribing! You will be notified when we launch.');
        setEmail('');
        setIsEmailValid(false);
      } else {
        setMessage('There was a problem with your subscription. Please try again later.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('There was a problem with your subscription. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/waitlist'); 
        setEmails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching emails:', error);
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  return (
    <div className="App">
      {loading && <LoadingBar />}
      <header className="header">
        <img src={`${process.env.PUBLIC_URL}/logo-placeholder.png`} alt="Photofactory Logo" className="logo-img" />
      </header>
      <main>
        <h1>Exciting Things Are Coming Your Way</h1>
        <h2>Join The Community Waitlist: Be The First To Experience The Magic!</h2>
        <form onSubmit={handleSubmit}>
          <div className={`input-container ${isEmailValid ? 'valid' : ''}`}>
            <input
              type="email"
              placeholder="Enter your Gmail address"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {isEmailValid && <FaCheckCircle className="tick-icon" />}
          </div>
          <button type="submit" disabled={!isEmailValid}>Submit</button>
        </form>
        <p className="highlight">{message}</p>
        <img src={`${process.env.PUBLIC_URL}/camera-placeholder.png`} alt="Camera Lens" className="camera-img" />
        <div className="social-section">
          <h3>Check Us Out On Social Media</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/_._photofactory?igsh=cDY1b2VhZmkyOGNy" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/share/12DqPhqeLc7/" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://youtube.com/@photofactory9094?si=xhV9o_sFwuWYGwPh" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
      </main>
      <footer>
        <div className="left">
          <p>© Photofactory 2025</p>
        </div>
        <div className="right">
          <p>In production, Stay tuned!</p>
        </div>
      </footer>
    </div>
  );
}

export default App;