import jwt from 'jsonwebtoken';

// Middleware to verify JWT and attach user_id to req.user
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({
        error: 'Missing or invalid Authorization header',
        status: 403,
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.slice(7);

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Attach user_id to req object
    req.user = { user_id: decoded.user_id };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Token has expired',
        status: 403,
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        error: 'Invalid token',
        status: 403,
      });
    }

    res.status(403).json({
      error: error.message || 'Authentication failed',
      status: 403,
    });
  }
};

export default requireAuth;
