/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/**
 * Middleware: Authenticate user.
 * Extracts the token from the request body and verifies it using the secret key.
 * If successful, sets the user information in the request.
 */
function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;

    if (!tokenFromBody) {
      throw new Error("No token provided");
    }

    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware: Requires user to be authenticated.
 * If the user is not authenticated, returns an unauthorized error.
 */
function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}

/**
 * Middleware: Requires correct username.
 * Compares the username in the request parameters with the authenticated user's username.
 * If they match, proceeds; otherwise, returns an unauthorized error.
 */
function ensureCorrectUser(req, res, next) {
  try {
    if (req.user && req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};