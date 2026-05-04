import express from 'express';
import { User } from '../models/index.js';

const router = express.Router();

// Get current authenticated user (from JWT)
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select('-password_hash');
    if (!user) return res.status(404).json({ error: 'User not found', status: 404 });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch user', status: 500 });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { email, password_hash, name, bio } = req.body;

    if (!email || !password_hash || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required',
        status: 400,
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        error: 'User with this email already exists',
        status: 400,
      });
    }

    const user = new User({
      email: email.toLowerCase(),
      password_hash,
      name,
      bio: bio || '',
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password_hash;

    res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to create user',
      status: 500,
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        status: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch user',
      status: 500,
    });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio },
      { new: true, runValidators: true }
    ).select('-password_hash');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        status: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to update user',
      status: 500,
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        status: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to delete user',
      status: 500,
    });
  }
});

export default router;
