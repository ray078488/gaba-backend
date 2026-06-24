import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'royal_exclusive_luxury_secret_key_123', {
    expiresIn: '30d',
  });
};

export default generateToken;
