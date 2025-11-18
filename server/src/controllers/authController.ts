import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { sendEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email';

const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, nickname, role, mobile, alternateMobile, address, spouse, children, nativePlace, church } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const generatedPassword = generatePassword(12);

    user = new User({
      name,
      email,
      password: generatedPassword,
      nickname,
      role: role || 'user',
      mobile,
      alternateMobile,
      address,
      spouse,
      children,
      nativePlace,
      church,
    });

    await user.save();

    const emailSent = await sendWelcomeEmail({
      to: user.email,
      name: user.name,
      email: user.email,
      password: generatedPassword,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    const response: any = {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    if (emailSent as any) {
      response.message = 'User created successfully. Login credentials sent to email.';
    } else {
      response.message = 'User created successfully. Email service unavailable - please contact admin for credentials.';
      response.warning = 'Email could not be sent';
      console.warn(`⚠️ Failed to send welcome email to ${user.email}. Temp password: ${generatedPassword}`);
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

 
    const resetUrl = `${process.env.APP_DEEP_LINK_SCHEME || 'bethelapp'}://reset-password?token=${resetToken}`;

    const emailSent:any = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    if (!emailSent ) {
  
      return res.json({ 
        success: true,
        message: 'Email service unavailable. Please use the verification code to reset your password.',
        resetToken: resetToken, 
        expiresIn: 600 
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent',
      resetToken: resetToken, 
      expiresIn: 600
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Successful - Bethel AG Dubai',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 20px;">
          <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #30D158 0%, #28A745 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <span style="font-size: 48px; color: white;">✓</span>
              </div>
              <h1 style="color: #333; margin: 0; font-size: 28px; font-weight: 700;">Password Reset Successful!</h1>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi ${user.name},
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Your password has been successfully reset. You can now log in to your account using your new password.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #30D158;">
              <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>Security Tip:</strong> If you didn't make this change or if you believe an unauthorized person has accessed your account, please contact us immediately.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 13px; margin: 0;">
                © ${new Date().getFullYear()} Bethel AG Dubai. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = (req as any).user.userId;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};