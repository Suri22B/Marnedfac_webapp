import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import User from '../../database/model/User';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { RoleCode } from '../../database/model/Role';
import { getUserData } from './utils';
import multer from 'multer';
import fs from 'fs';
import { transporter } from '../../helpers/mail-service';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { name, contact } = req.body;
    const dir = `./uploads/soldier/${name.replace(/ /g, '-')}-${contact}`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const splittedArray = file.originalname?.split('.');
    splittedArray[0] = file.fieldname;
    const newFilename = splittedArray.join('.');
    cb(null, newFilename);
  },
});

// accept if it's similar to filetype else rejct the file
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Regex to match file extensions (e.g., .jpeg, .jpg, .png)
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(file.originalname.toLowerCase());

  if (extname) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new BadRequestError(
        'Invalid file type. Only JPEG,PNG and WEBP are allowed!',
      ),
      false,
    ); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
  '/create',
  upload.single('profilePicUrl'),
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('Soldier already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        ...req.body,
        profilePicUrl: req.file?.filename,
        password: passwordHash,
        verificationToken, // Save the token in the user record
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.SOLDIER,
    );

    // Send verification email
    const verificationUrl = `${process.env.SERVER_URL}/api/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking the link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };
    await transporter.sendMail(mailOptions);

    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey,
    );
    const userData = await getUserData(createdUser);

    new SuccessResponse(
      'Signup successful. Please check your email to verify your account.',
      {
        user: userData,
        tokens: tokens,
      },
    ).send(res);
  }),
);

export default router;
