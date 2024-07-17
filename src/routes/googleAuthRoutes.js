import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log('Ticket:', ticket);

    const { name, email } = ticket.getPayload();
    console.log('Payload:', { name, email });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email });
      await user.save();
    }

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true });
      res.json(user);
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).send('Server error');
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    console.log('Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);

    const user = await User.findById(decoded.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).send('Server error');
  }
});

export default router;
