const jwt = require('jsonwebtoken');
const config = require('./config'); // Import your JWT secret and expiration configuration

const generateAuthToken = (userId, role) => {
  const payload = {
    user: {
      id: userId,
      role: role
    }
  };

  const options = {
    expiresIn: config.jwtExpiration
  };

  return jwt.sign(payload, config.jwtSecret, options);
};

module.exports = { generateAuthToken };
