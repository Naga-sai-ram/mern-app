class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // 'Error' breaks prototype chain here
        this.code = errorCode; // Custom property for error code
    }
}   

module.exports = HttpError;
// This class can be used to create custom HTTP errors with a message and an error code.