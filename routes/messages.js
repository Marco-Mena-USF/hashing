const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message'); // Assuming you have a Message model
const User = require('../models/User'); // Assuming you have a User model

const router = express.Router();

/** GET /messages/:id - get detail of message. */
router.get('/:id', async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const { username } = req.user; // Assuming req.user is set by your authentication middleware

    // Get message details
    const message = await Message.get(messageId);

    // Check if the currently logged-in user is either the sender or recipient
    if (message.from_user.username !== username && message.to_user.username !== username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.json({ message });
  } catch (error) {
    return next(error);
  }
});

/** POST /messages - post message. */
router.post('/', async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const { username } = req.user; // Assuming req.user is set by your authentication middleware

    // Check if the sender exists
    const fromUser = await User.get(username);
    if (!fromUser) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    // Check if the recipient exists
    const toUser = await User.get(to_username);
    if (!toUser) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Post the message
    const newMessage = await Message.create({
      from_username: username,
      to_username,
      body,
    });

    return res.status(201).json({ message: newMessage });
  } catch (error) {
    return next(error);
  }
});

/** POST /messages/:id/read - mark message as read. */
router.post('/:id/read', async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const { username } = req.user; // Assuming req.user is set by your authentication middleware

    // Mark message as read
    const updatedMessage = await Message.markRead(messageId);

    // Check if the currently logged-in user is the intended recipient
    if (updatedMessage.to_user.username !== username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.json({ message: updatedMessage });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;