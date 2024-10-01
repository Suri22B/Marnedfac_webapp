import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import authentication from '../../auth/authentication';
import fs from 'fs';
import multer from 'multer';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

const storage = multer.diskStorage({
  destination: async (req: ProtectedRequest, file, cb) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    cb(
      null,
      `./uploads/soldier/${user?.name?.replace(/ /g, '-')}-${user?.contact}`,
    );
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

router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    return new SuccessResponse('success', {
      ...user,
      profilePicUrl: `${process.env.SERVER_URL}/soldier/${user.name?.replace(
        / /g,
        '-',
      )}-${user.contact}/${user.profilePicUrl}`,
    }).send(res);
  }),
);

router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    const currPath = `./uploads/soldier/${user?.name?.replace(
      / /g,
      '-',
    )}-${user?.contact}`;
    const newPath = `./uploads/soldier/${req.body?.name?.replace(
      / /g,
      '-',
    )}-${req.body?.contact}`;

    fs.rename(currPath, newPath, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully renamed the directory.');
      }
    });

    await UserRepo.updateInfo({ ...user, ...req.body });

    const data = _.pick(user, ['name', 'profilePicUrl']);

    return new SuccessResponse('Profile updated', data).send(res);
  }),
);

router.put(
  '/picture',
  upload.single('profilePicUrl'),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    await UserRepo.updateInfo({ ...user, profilePicUrl: req.file?.filename });

    const data = _.pick(user, ['name', 'profilePicUrl']);

    return new SuccessResponse('Profile picture updated', data).send(res);
  }),
);

router.delete(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.deleteProfileById(req.user._id);

    return new SuccessResponse('Profile Deleted Successfully', user).send(res);
  }),
);

export default router;
