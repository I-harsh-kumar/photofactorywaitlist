const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
  const newEmail = new Email({ email });
  await newEmail.save();
  res.send('Email added to waitlist');
});

// New route to fetch all emails
app.get('/api/waitlist', async (req, res) => {
  const emails = await Email.find();
  res.json(emails);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
