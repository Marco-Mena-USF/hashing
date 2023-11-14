const express = require('express');
const User = require('../models/User'); // Assuming you have a User model
const Message = require('../models/Message'); // Assuming you have a Message model

const router = express.Router();

/** GET /users - get list of users. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.all();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

/** GET /users/:username - get detail of a user. */
router.get('/:username', async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.get(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

/** GET /users/:username/to - get messages to a user. */
router.get('/:username/to', async (req, res, next) => {
  try {
    const username = req.params.username;
    const messagesToUser = await Message.messagesTo(username);

    return res.json({ messages: messagesToUser });
  } catch (error) {
    return next(error);
  }
});

/** GET /users/:username/from - get messages from a user. */
router.get('/:username/from', async (req, res, next) => {
  try {
    const username = req.params.username;
    const messagesFromUser = await Message.messagesFrom(username);

    return res.json({ messages: messagesFromUser });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
