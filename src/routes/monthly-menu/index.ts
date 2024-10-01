import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import MonthlyMenuRepo from '../../database/repository/MonthlyMenuRepo';
import MonthlyMenu from '../../database/model/MonthlyMenu';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import { BadRequestError } from '../../core/ApiError';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
// store the images on disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { defac } = req.body;
    const dir = `./uploads/monthly-menu/${defac}`;
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
  upload.single('menuUrl'),
  validator(schema.monthlyMenu),
  asyncHandler(async (req, res) => {
    const menu = await MonthlyMenuRepo.create({
      ...req.body,
      menuUrl: req.file?.filename,
    } as MonthlyMenu);
    new SuccessResponse('Menu added Successfully!', {
      menu: menu,
    }).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const allMenu = await MonthlyMenuRepo.getAll();
    const updatedMenu = allMenu.map((menu) => ({
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/monthly-menu/${menu.defac._id}/${menu?.menuUrl}`,
      defac: {
        ...menu.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${menu?.defac?.name?.replace(/ /g, '-')}/${menu?.defac
          ?.profilePicUrl}`,
      },
    }));
    new SuccessResponse('Fetched all menus', {
      menuList: updatedMenu,
    }).send(res);
  }),
);

router.get(
  '/:defacId',
  asyncHandler(async (req, res) => {
    const allMenu = await MonthlyMenuRepo.getAllMonthlyMenuByDefac(
      req.params.defacId,
    );
    const updatedMenu = allMenu.map((menu) => ({
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/monthly-menu/${menu.defac._id}/${menu?.menuUrl}`,
      defac: {
        ...menu.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${menu?.defac?.name?.replace(/ /g, '-')}/${menu?.defac
          ?.profilePicUrl}`,
      },
    }));
    new SuccessResponse('Fetched all menus by defac', {
      menuList: updatedMenu,
    }).send(res);
  }),
);

router.get(
  '/latest/:defacId',
  asyncHandler(async (req, res) => {
    const menu = await MonthlyMenuRepo.getLatestMonthlyMenuByDefac(
      req.params.defacId,
    );
    new SuccessResponse('Fetched latest monthly menu by defac', {
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/monthly-menu/${menu?.defac?._id}/${menu?.menuUrl}`,
      defac: {
        ...menu?.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${menu?.defac?.name?.replace(/ /g, '-')}/${menu?.defac
          ?.profilePicUrl}`,
      },
    }).send(res);
  }),
);

router.get(
  '/single/:menuId',
  asyncHandler(async (req, res) => {
    const menu = await MonthlyMenuRepo.getById(req.params.menuId);
    new SuccessResponse('Fetched menu by id', {
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/monthly-menu/${menu?.defac?._id}/${menu?.menuUrl}`,
      defac: {
        ...menu?.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${menu?.defac?.name?.replace(/ /g, '-')}/${menu?.defac
          ?.profilePicUrl}`,
      },
    }).send(res);
  }),
);

router.delete(
  '/:menuId',
  asyncHandler(async (req, res) => {
    const menu = await MonthlyMenuRepo.getById(req.params.menuId);
    fs.rm(
      `uploads/monthly-menu/${menu?.defac._id}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log('Folder deleted!');
      },
    );
    const response = await MonthlyMenuRepo.deleteById(req.params.menuId);
    new SuccessResponse('Menu deleted!', response).send(res);
  }),
);

router.patch(
  '/',
  upload.single('menuUrl'),
  asyncHandler(async (req, res) => {
    const response = await MonthlyMenuRepo.update({
      ...req.body,
      _id: req.body.id,
      menuUrl: req.file?.filename,
    } as MonthlyMenu);
    new SuccessResponse('Menu updated!', response).send(res);
  }),
);

export default router;
