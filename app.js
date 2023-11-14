/** Express app for message.ly. */

const express = require("express");
const cors = require("cors");
const { authenticateJWT } = require("./middleware/auth");

const ExpressError = require("./expressError");
const app = express();

// Allow both form-encoded and json body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow connections to all routes from any browser
app.use(cors());

// Get auth token for all routes
app.use(authenticateJWT);

/** Routes */

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** General error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  // Log the error only if not in the "test" environment
  if (process.env.NODE_ENV !== "test") {
    console.error(err.toString()); // Log a formatted error message
  }

  return res.json({
    error: {
      message: err.message,
      status: err.status,
    },
  });
});

module.exports = app;