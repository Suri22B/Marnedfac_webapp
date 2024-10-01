import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import MenuRepo from '../../database/repository/MenuRepo';
import Menu from '../../database/model/Menu';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import { BadRequestError } from '../../core/ApiError';
import multer from 'multer';
import fs from 'fs';
import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';

const router = express.Router();
// store the images on disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { name, defac } = req.body;
    const dir = `./uploads/menu/${name.replace(/[: ]/g, '-')}-${defac}`;
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
  validator(schema.menu),
  asyncHandler(async (req, res) => {
    const existingMenu = await MenuRepo.findByMenu(
      req.body.name,
      req.body.defac,
    );
    if (existingMenu) throw new BadRequestError('Menu already added!');
    const menu = await MenuRepo.create({
      ...req.body,
      menuUrl: req.file?.filename,
    } as Menu);
    new SuccessResponse('Menu added Successfully!', {
      menu: menu,
    }).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const allMenu = await MenuRepo.getAll();

    const updatedMenu = allMenu.map((menu) => ({
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/menu/${menu?.name?.replace(
        /[: ]/g,
        '-',
      )}-${menu?.defac?._id}/${menu?.menuUrl}`,
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
  '/defac',
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const allMenu = await MenuRepo.getAllMenusByDefacs(
      req.user?.defaultDefac._id,
    );
    const updatedMenu = allMenu.map((menu) => ({
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/menu/${menu?.name?.replace(
        /[: ]/g,
        '-',
      )}-${menu.defac._id}/${menu?.menuUrl}`,
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
  '/defac/:defacId',
  asyncHandler(async (req, res) => {
    const allMenu = await MenuRepo.getAllMenusByDefacsList(req.params.defacId);
    const updatedMenu = allMenu.map((menu) => ({
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/menu/${menu?.name?.replace(
        /[: ]/g,
        '-',
      )}-${menu.defac._id}/${menu?.menuUrl}`,
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
  '/single/:menuId',
  asyncHandler(async (req, res) => {
    const menu = await MenuRepo.getById(req.params.menuId);
    new SuccessResponse('Fetched menu by id', {
      ...menu,
      menuUrl: `${process.env.SERVER_URL}/menu/${menu?.name?.replace(
        /[: ]/g,
        '-',
      )}-${menu?.defac._id}/${menu?.menuUrl}`,
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
    const menu = await MenuRepo.getById(req.params.menuId);
    fs.rm(
      `uploads/menu/${menu?.name?.replace(/[: ]/g, '-')}-${menu?.defac._id}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log('Folder deleted!');
      },
    );
    const response = await MenuRepo.deleteById(req.params.menuId);
    new SuccessResponse('Menu deleted!', response).send(res);
  }),
);

router.patch(
  '/',
  upload.single('menuUrl'),
  asyncHandler(async (req, res) => {
    const response = await MenuRepo.update({
      ...req.body,
      _id: req.body.id,
      menuUrl: req.file?.filename,
    } as Menu);
    new SuccessResponse('Menu updated!', response).send(res);
  }),
);

router.patch(
  '/active',
  asyncHandler(async (req, res) => {
    const response = await MenuRepo.update({
      ...req.body,
      _id: req.body.id,
    } as Menu);
    new SuccessResponse('Activity updated!', response).send(res);
  }),
);

export default router;
