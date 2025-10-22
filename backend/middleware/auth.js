import { auth } from '../firebase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (auth) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    } else {
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
