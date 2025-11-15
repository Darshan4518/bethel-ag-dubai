
import express from 'express';
import { body } from 'express-validator';
import { register, login, forgotPassword, resetPassword, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  resetPassword
);

router.post(
  '/change-password',
  authenticate,
  [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  changePassword
);

export default router;


