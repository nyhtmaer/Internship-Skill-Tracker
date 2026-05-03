import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, name, bio } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required',
        status: 400,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        error: 'User with this email already exists',
        status: 400,
      });
    }

    // Create new user (password is hashed in pre-save hook)
    const user = new User({
      email: email.toLowerCase(),
      password_hash: password, // Store in password_hash, will be hashed by pre-save hook
      name,
      bio: bio || '',
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRY || '30m' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to register user',
      status: 500,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        status: 400,
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');

    if (!user) {
      return res.status(403).json({
        error: 'Invalid email or password',
        status: 403,
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(403).json({
        error: 'Invalid email or password',
        status: 403,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRY || '30m' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to login',
      status: 500,
    });
  }
};
