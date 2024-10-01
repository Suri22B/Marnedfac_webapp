import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';

import asyncHandler from '../../helpers/asyncHandler';
import { getUserData } from './utils';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { token } = req.query;

    // Find the user by the verification token
    const user: any = await UserRepo.findByVerificationToken(token as string);
    if (!user)
      throw new BadRequestError('Invalid or expired verification token.');

    // Verify the user
    user.verified = true;
    user.verificationToken = undefined; // Clear the verification token
    await UserRepo.updateInfo({ ...user });

    // Redirect to a frontend page after successful verification
    return res.redirect(`${process.env.SERVER_URL}?email-verified=true`);
  }),
);

export default router;
