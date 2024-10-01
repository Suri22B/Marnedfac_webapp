import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import BannerRepo from '../../database/repository/BannerRepo';
import Banner from '../../database/model/Banner';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import { BadRequestError } from '../../core/ApiError';
import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Function to generate a unique folder name
const generateUniqueFolderName = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8); // Random string
  return `${timestamp}-${randomStr}`;
};

let uniqueFolderName = '';

// store the images on disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    uniqueFolderName = generateUniqueFolderName();
    const dir = `./uploads/banner/${uniqueFolderName}`;
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
  '/',
  upload.single('bannerUrl'),
  validator(schema.banner),
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const bannerList = await BannerRepo.getAll();
    if (bannerList.length === 3)
      throw new BadRequestError(
        "You can't add more than 3 banners. Delete previous one and add new or edit existing banner!",
      );

    const existingBanner = await BannerRepo.findByBanner(req.body.title);
    if (existingBanner) throw new BadRequestError('Banner already added!');

    const banner = await BannerRepo.create({
      ...req.body,
      createdBy: req.user?._id,
      bannerUrl: req.file?.filename,
      folderName: uniqueFolderName,
    } as Banner);
    uniqueFolderName = '';
    new SuccessResponse('Banner added Successfully!', banner).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const bannerList = await BannerRepo.getAll();
    const updatedBannerList = bannerList?.map((banner) => ({
      ...banner,
      bannerUrl: `${process.env.SERVER_URL}/banner/${banner?.folderName}/${banner?.bannerUrl}`,
    }));
    new SuccessResponse('Fetched all banner', updatedBannerList).send(res);
  }),
);

router.get(
  '/:bannerId',
  asyncHandler(async (req, res) => {
    const banner = await BannerRepo.getById(req.params.bannerId);
    new SuccessResponse('Fetched banner by id', {
      ...banner,
      bannerUrl: `${process.env.SERVER_URL}/banner/${banner?.folderName}/${banner?.bannerUrl}`,
    }).send(res);
  }),
);

router.delete(
  '/:bannerId',
  asyncHandler(async (req, res) => {
    const banner = await BannerRepo.getById(req.params.bannerId);
    fs.rm(
      `uploads/banner/${banner?.folderName}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log('Folder deleted!');
      },
    );

    const response = await BannerRepo.deleteById(req.params.bannerId);
    new SuccessResponse('Banner deleted', response).send(res);
  }),
);

router.patch(
  '/',
  upload.single('bannerUrl'),
  asyncHandler(async (req, res) => {
    const updateBanner: Partial<Banner> = {
      ...req.body,
      _id: req.body.id,
    };

    if (req.file !== undefined && req.file !== null) {
      updateBanner.bannerUrl = req.file?.filename;
      updateBanner.folderName = uniqueFolderName;
    }

    const response = await BannerRepo.update(updateBanner as Banner);

    uniqueFolderName = '';
    new SuccessResponse('Banner updated', response).send(res);
  }),
);

export default router;
