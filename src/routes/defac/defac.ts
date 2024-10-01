import express, { NextFunction, raw } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import DefacRepo from '../../database/repository/DefacRepo';
import User, { UserModel } from '../../database/model/User';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../../core/ApiError';
import multer from 'multer';
import { RoleCode } from '../../database/model/Role';
import fs from 'fs';
import crypto from 'crypto';
import { transporter } from '../../helpers/mail-service';
import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';
import { FeedbackModel } from '../../database/model/Feedback';
import mongoose from 'mongoose';

const router = express.Router();

// store the images on disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { name, contact } = req.body;
    const dir = `./uploads/profile/${name.replace(/ /g, '-')}`;
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

// add defac
router.post(
  '/',
  upload.fields([
    { name: 'profilePicUrl', maxCount: 1 },
    { name: 'coverPicUrl', maxCount: 1 },
  ]),
  validator(schema.defac),
  asyncHandler(async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const existingDefac = await DefacRepo.findByEmail(req.body.email);
    if (existingDefac) throw new BadRequestError('Defac already registered');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const defac = await DefacRepo.create(
      {
        ...req.body,
        profilePicUrl: files['profilePicUrl'][0]?.filename,
        coverPicUrl: files['coverPicUrl'][0]?.filename,
        password: passwordHash,
        verificationToken, // Save the token in the user record
      } as User,
      RoleCode.DEFAC,
    );

    const verificationUrl = `${process.env.SERVER_URL}/api/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking the link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };
    await transporter.sendMail(mailOptions);

    new SuccessResponse(
      'Defac added Successfully! Please ask defac to check email to verify your account.',
      {
        defac: defac,
      },
    ).send(res);
  }),
);

// get all defac lists
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const defacList = await DefacRepo.getAll();

    const updatedDefacList = await Promise.all(
      defacList?.map(async (defac: User) => {
        // calculate  average rating
        const aggregateRating = await FeedbackModel.aggregate([
          { $match: { defac: new mongoose.Types.ObjectId(defac._id) } },
          { $group: { _id: '$defac', avgRating: { $avg: '$rating' } } },
        ]);

        const newRating = aggregateRating[0]?.avgRating || 0;

        // calculate total rating count
        const totalRating = await FeedbackModel.find({ defac: defac._id });

        return {
          ...defac,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/profile/${defac?.name?.replace(/ /g, '-')}/${defac?.profilePicUrl}`,
          coverPicUrl: `${
            process.env.SERVER_URL
          }/profile/${defac?.name?.replace(/ /g, '-')}/${defac?.coverPicUrl}`,
          rating: newRating,
          totalRating: totalRating.length,
        };
      }),
    );
    new SuccessResponse('Fetched all defacs', {
      updatedDefacList,
    }).send(res);
  }),
);

// get soldier defac lists
router.get(
  '/soldier',
  authentication,
  asyncHandler(async (req: any, res) => {
    const post = req.user?.post;

    const defacList = await DefacRepo.getAllDefacByPosts(post);

    const updatedDefacList = await Promise.all(
      defacList?.map(async (defac: User) => {
        // calculate  average rating
        const aggregateRating = await FeedbackModel.aggregate([
          { $match: { defac: new mongoose.Types.ObjectId(defac._id) } },
          { $group: { _id: '$defac', avgRating: { $avg: '$rating' } } },
        ]);

        const newRating = aggregateRating[0]?.avgRating || 0;

        // calculate total rating count
        const totalRating = await FeedbackModel.find({ defac: defac._id });

        return {
          ...defac,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/profile/${defac?.name?.replace(/ /g, '-')}/${defac?.profilePicUrl}`,
          coverPicUrl: `${
            process.env.SERVER_URL
          }/profile/${defac?.name?.replace(/ /g, '-')}/${defac?.coverPicUrl}`,
          rating: newRating,
          totalRating: totalRating.length,
        };
      }),
    );
    new SuccessResponse('Fetched all defacs', {
      updatedDefacList,
    }).send(res);
  }),
);

// get defac by id
router.get(
  '/default',
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const defac = await DefacRepo.getById(req.user?.defaultDefac._id);

    // calculate  average rating
    const aggregateRating = await FeedbackModel.aggregate([
      { $match: { defac: new mongoose.Types.ObjectId(defac?._id) } },
      { $group: { _id: '$defac', avgRating: { $avg: '$rating' } } },
    ]);

    const newRating = aggregateRating[0]?.avgRating || 0;

    // calculate total rating count
    const totalRating = await FeedbackModel.find({ defac: defac?._id });

    new SuccessResponse('Fetched defac detail!', {
      ...defac,
      profilePicUrl: `${process.env.SERVER_URL}/profile/${defac?.name?.replace(
        / /g,
        '-',
      )}/${defac?.profilePicUrl}`,
      coverPicUrl: `${process.env.SERVER_URL}/profile/${defac?.name?.replace(
        / /g,
        '-',
      )}/${defac?.coverPicUrl}`,
      rating: newRating,
      totalRating: totalRating.length,
    }).send(res);
  }),
);

// get defac by id
router.get(
  '/:defacId',
  asyncHandler(async (req, res) => {
    const defac = await DefacRepo.getById(req.params.defacId);

    // calculate  average rating
    const aggregateRating = await FeedbackModel.aggregate([
      { $match: { defac: new mongoose.Types.ObjectId(defac?._id) } },
      { $group: { _id: '$defac', avgRating: { $avg: '$rating' } } },
    ]);

    const newRating = aggregateRating[0]?.avgRating || 0;

    // calculate total rating count
    const totalRating = await FeedbackModel.find({ defac: defac?._id });

    new SuccessResponse('Fetched defac!', {
      ...defac,
      profilePicUrl: `${process.env.SERVER_URL}/profile/${defac?.name?.replace(
        / /g,
        '-',
      )}/${defac?.profilePicUrl}`,
      coverPicUrl: `${process.env.SERVER_URL}/profile/${defac?.name?.replace(
        / /g,
        '-',
      )}/${defac?.coverPicUrl}`,
      rating: newRating,
      totalRating: totalRating.length,
    }).send(res);
  }),
);

// delete defac by id
router.delete(
  '/:defacId',
  asyncHandler(async (req, res) => {
    // get all soldier list where selected defac is default defac for the soldier
    const defaultDefacSoldier = await UserModel.find({
      defaultDefac: req.params.defacId,
    })
      .select(
        '+email +name +profilePicUrl +rank +post +unit +contact +defaultDefac',
      )
      .lean()
      .exec();

    // get all defac list
    const defacList = await DefacRepo.getAll();

    // replace the default defac list
    await Promise.all(
      defaultDefacSoldier?.map(async (soldier: User) => {
        const randomDefac = defacList.find(
          (defac) =>
            !new mongoose.Types.ObjectId(defac._id).equals(
              new mongoose.Types.ObjectId(soldier.defaultDefac?._id),
            ),
        );
        return await UserModel.findByIdAndUpdate(
          soldier._id,
          { defaultDefac: randomDefac?._id },
          {
            new: true,
          },
        );
      }),
    );

    // delete the image folder
    const defac = await DefacRepo.getById(req.params.defacId);
    fs.rm(
      `uploads/profile/${defac?.name?.replace(/ /g, '-')}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log('Folder deleted!');
      },
    );

    // delete defac from database
    const response = await DefacRepo.deleteById(req.params.defacId);
    new SuccessResponse('Defac deleted!', response).send(res);
  }),
);

//update defac
router.patch(
  '/',
  upload.fields([
    { name: 'profilePicUrl', maxCount: 1 },
    { name: 'coverPicUrl', maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let passwordHash = '';
    if (req.body?.password?.length > 0) {
      passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    // Initialize the update object with existing body data
    const updateData: Partial<User> = {
      ...req.body,
      _id: req.body.id,
    };

    // set the hashed password only if it exist
    if (req.body?.password?.length > 0) {
      updateData.password = passwordHash;
    }

    // Check if 'profilePicUrl' is uploaded and add to updateData if true
    if (files['profilePicUrl'] && files['profilePicUrl'][0]) {
      updateData.profilePicUrl = files['profilePicUrl'][0].filename;
    }

    // Check if 'coverPicUrl' is uploaded and add to updateData if true
    if (files['coverPicUrl'] && files['coverPicUrl'][0]) {
      updateData.coverPicUrl = files['coverPicUrl'][0].filename;
    }

    // Call your repository's update method with the populated updateData
    const response = await DefacRepo.update(updateData as User);

    // Send the success response
    new SuccessResponse('Defac updated!', response).send(res);
  }),
);

// change defac status
router.patch(
  '/status',
  asyncHandler(async (req, res) => {
    const response = await DefacRepo.update({
      ...req.body,
      _id: req.body.id,
    } as User);
    new SuccessResponse('Status updated!', response).send(res);
  }),
);

// change opening and closing hour
router.patch(
  '/update-time',
  asyncHandler(async (req, res) => {
    const response = await DefacRepo.update({
      ...req.body,
      _id: req.body.id,
    } as User);
    new SuccessResponse('Time updated!', response).send(res);
  }),
);

export default router;
