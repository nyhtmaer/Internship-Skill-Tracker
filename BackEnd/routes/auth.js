import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Register endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

export default router;
