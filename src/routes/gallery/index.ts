import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import GalleryRepo from '../../database/repository/GalleryRepo';
import Gallery from '../../database/model/Gallery';
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
    const dir = `./uploads/gallery/${uniqueFolderName}`;
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
  upload.single('galleryUrl'),
  validator(schema.gallery),
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const gallery = await GalleryRepo.create({
      ...req.body,
      createdBy: req.user?._id,
      galleryUrl: req.file?.filename,
      folderName: uniqueFolderName,
    } as Gallery);
    uniqueFolderName = '';
    new SuccessResponse('Gallery added Successfully!', gallery).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const galleryList = await GalleryRepo.getAll();
    const updatedGalleryList = galleryList?.map((gallery) => ({
      ...gallery,
      galleryUrl: `${process.env.SERVER_URL}/gallery/${gallery?.folderName}/${gallery?.galleryUrl}`,
    }));
    new SuccessResponse('Fetched all gallery', updatedGalleryList).send(res);
  }),
);

router.get(
  '/:galleryId',
  asyncHandler(async (req, res) => {
    const gallery = await GalleryRepo.getById(req.params.galleryId);
    new SuccessResponse('Fetched gallery by id', {
      ...gallery,
      galleryUrl: `${process.env.SERVER_URL}/gallery/${gallery?.folderName}/${gallery?.galleryUrl}`,
    }).send(res);
  }),
);

router.delete(
  '/:galleryId',
  asyncHandler(async (req, res) => {
    const gallery = await GalleryRepo.getById(req.params.galleryId);
    fs.rm(
      `uploads/gallery/${gallery?.folderName}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log('Folder deleted!');
      },
    );

    const response = await GalleryRepo.deleteById(req.params.galleryId);
    new SuccessResponse('Gallery deleted', response).send(res);
  }),
);

router.patch(
  '/',
  upload.single('galleryUrl'),
  asyncHandler(async (req, res) => {
    const updateGallery: Partial<Gallery> = {
      ...req.body,
      _id: req.body.id,
    };

    if (req.file !== undefined && req.file !== null) {
      updateGallery.galleryUrl = req.file?.filename;
      updateGallery.folderName = uniqueFolderName;
    }

    const response = await GalleryRepo.update(updateGallery as Gallery);

    uniqueFolderName = '';
    new SuccessResponse('Gallery updated', response).send(res);
  }),
);

export default router;
