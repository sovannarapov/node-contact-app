const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/constants');

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
      if (error) {
        res.status(UNAUTHORIZED);
        throw new Error('The user is unauthorized');
      }
      req.user = decoded.user;
      next();
    });

    if (!token) {
      res.status(UNAUTHORIZED);
      throw new Error('The user is unauthorized or token is misssing');
    }
  }
});

module.exports = validateToken;
