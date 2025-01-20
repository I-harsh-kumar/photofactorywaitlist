import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FaInstagram, FaYoutube, FaFacebook } from 'react-icons/fa';

function LoadingBar() {
  return <div className="loading-bar"></div>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emails, setEmails] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emails.some(existingEmail => existingEmail.email === email)) {
      setMessage('This email is already on the waitlist'); // Show message if email is already on the waitlist
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/waitlist', { email });
      setMessage(response.data.message || 'Email added to waitlist'); // Use the response data or a default message
      setEmail('');
    } catch (error) {
      setMessage('Error adding email to waitlist');
    }
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000); // Simulate a loading time
    const fetchEmails = async () => {
      const response = await axios.get('http://localhost:5000/api/waitlist');
      setEmails(response.data);
    };
    fetchEmails();
  }, []);

  return (
    <div className="App">
      {loading && <LoadingBar />}
      <header className="header">
        <img src={`${process.env.PUBLIC_URL}/logo-placeholder.png`} alt="Photofactory Logo" className="logo-img" /> {/* Updated image path */}
      </header>
      <main>
        <h1>Exciting Things Are Coming Your Way</h1>
        <h2>Join The Community Waitlist: Be The First To Experience The Magic!</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        <img src={`${process.env.PUBLIC_URL}/camera-placeholder.png`} alt="Camera Lens" className="camera-img" /> {/* Updated image path */}
        <p className="highlight">{message}</p> {/* Apply the highlight class here */}
        <div className="social-section">
          <h3>Check Us Out On Social Media</h3>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
      </main>
      <footer>
        <div className="left">
          <p>Copyrights @Photofactory2025</p>
        </div>
        <div className="right">
          <p>In production, Stay tuned!</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
