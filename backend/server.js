const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailValidator = require('email-validator'); // Install using npm install email-validator

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/photo-factory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const emailSchema = new mongoose.Schema({
  email: String,
});

const Email = mongoose.model('Email', emailSchema);

app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;

  // Basic email validation (adjust regex as needed)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  // Check for duplicate email
  try {
    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(200).json({ message: 'Thank you for subscribing! You will be notified when we launch.' });
  } catch (error) {
    console.error('Error adding email to waitlist:', error);
    res.status(500).json({ message: 'There was a problem with your subscription. Please try again later.' });
  }
});

// New route to fetch all emails
app.get('/api/waitlist', async (req, res) => {
  const emails = await Email.find();
  res.json(emails);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});