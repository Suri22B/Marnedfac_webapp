import express from 'express';
import crypto from 'crypto';
import asyncHandler from '../../helpers/asyncHandler';
import UserRepo from '../../database/repository/UserRepo';
import { transporter } from '../../helpers/mail-service';
import bcrypt from 'bcrypt';

const router = express.Router();
// Forgot Password API
router.post(
  '/password/forgot',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await UserRepo.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique token
    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token and expiry to user's record
    user.resetPasswordToken = token;
    user.resetPasswordExpires = resetTokenExpiry;
    await UserRepo.updateInfo(user);

    // Send the reset email
    const resetUrl = `${process.env.SERVER_URL}/reset-password?token=${token}`;

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ statusCode: '10000', message: 'Email sent' });
  }),
);

// Reset Password API
router.post(
  '/password/reset',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const user: any = await UserRepo.findByResetToken(token);

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Update the password and clear the reset token and expiry
    user.password = await bcrypt.hash(newPassword, 10); // Hash the password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.verified = true;
    await UserRepo.updateInfo(user);

    res
      .status(200)
      .json({ statusCode: '10000', message: 'Password has been updated' });
  }),
);

export default router;
