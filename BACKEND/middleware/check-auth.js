const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    try{
       const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
       if (!token) {
        throw new Error('Authentication failed, token not provided.');
      }
      const decodedToken=jwt.verify(token,process.env.JWT_KEY); // Verify token using secret key
      req.userData = { userId: decodedToken.userId }; // Attach user data to request
      next();
    }catch(err){
        const error = new HttpError('Authentication failed, please provide a valid token.', 401);
        return next(error);
    }
};   

