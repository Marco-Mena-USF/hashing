/**
 * ExpressError extends the native JavaScript Error class to facilitate
 * easy addition of an HTTP status code when creating an instance.
 * The error-handling middleware will utilize instances of this class.
 */
class ExpressError extends Error {
  constructor(message, status, errorCode = 'GENERIC_ERROR', logError = true, data = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.errorCode = errorCode;
    this.timestamp = new Date();
    this.data = data;

    // Capture the stack trace efficiently
    Error.captureStackTrace(this, this.constructor);

    // Log the error to the console if specified
    if (logError) {
      console.error(this.toString());
    }
  }

  /**
   * Custom toString method to display a formatted error message.
   */
  toString() {
    let errorString = `[${this.timestamp.toISOString()}] ${this.name} (${this.errorCode}): ${this.message}`;
    if (this.data) {
      errorString += `\nAdditional Data: ${JSON.stringify(this.data, null, 2)}`;
    }
    errorString += `\nStack Trace:\n${this.stack}`;
    return errorString;
  }
}

module.exports = ExpressError;