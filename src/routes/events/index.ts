import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import EventRepo from '../../database/repository/EventsRepo';
import Event from '../../database/model/Event';
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
    const dir = `./uploads/event/${name.replace(/ /g, '-')}-${defac}`;
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
  upload.single('eventUrl'),
  validator(schema.event),
  asyncHandler(async (req, res) => {
    const existingEvent = await EventRepo.findByEvent(
      req.body.name,
      req.body.defac,
    );
    if (existingEvent)
      throw new BadRequestError('Event already added registered');
    const event = await EventRepo.create({
      ...req.body,
      eventUrl: req.file?.filename,
    } as Event);
    new SuccessResponse('Event added Successfully!', {
      event: event,
    }).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const allEvent = await EventRepo.getAll();
    const updatedEvent = allEvent.map((event) => ({
      ...event,
      eventUrl: `${process.env.SERVER_URL}/event/${event?.name?.replace(
        / /g,
        '-',
      )}-${event?.defac?._id}/${event?.eventUrl}`,
      defac: {
        ...event.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${event?.defac?.name?.replace(/ /g, '-')}/${event?.defac
          ?.profilePicUrl}`,
      },
    }));
    new SuccessResponse('Fetched all events', {
      eventList: updatedEvent,
    }).send(res);
  }),
);

router.get(
  '/upcoming-events',
  asyncHandler(async (req, res) => {
    const allEvent = await EventRepo.getUpcomingEvents();
    const updatedEvent = allEvent.map((event) => ({
      ...event,
      eventUrl: `${process.env.SERVER_URL}/event/${event?.name?.replace(
        / /g,
        '-',
      )}-${event?.defac?._id}/${event?.eventUrl}`,
      defac: {
        ...event.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${event?.defac?.name?.replace(/ /g, '-')}/${event?.defac
          ?.profilePicUrl}`,
      },
    }));
    new SuccessResponse('Fetched all events', {
      eventList: updatedEvent,
    }).send(res);
  }),
);

router.get(
  '/defac',
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const allEvent = await EventRepo.getAllEventsByDefac(
      req.user?.defaultDefac._id,
    );
    const updatedEvent = allEvent.map((event) => ({
      ...event,
      eventUrl: `${process.env.SERVER_URL}/event/${event?.name?.replace(
        / /g,
        '-',
      )}-${event?.defac?._id}/${event?.eventUrl}`,
      defac: {
        ...event.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${event?.defac?.name?.replace(/ /g, '-')}/${event?.defac
          ?.profilePicUrl}`,
      },
    }));
    new SuccessResponse('Fetched all events by defac', {
      eventList: updatedEvent,
    }).send(res);
  }),
);

router.get(
  '/defac/:defacId',
  asyncHandler(async (req, res) => {
    const allEvent = await EventRepo.getAllEventsByDefac(req.params.defacId);
    const updatedEvent = allEvent.map((event) => ({
      ...event,
      eventUrl: `${process.env.SERVER_URL}/event/${event?.name?.replace(
        / /g,
        '-',
      )}-${event?.defac?._id}/${event?.eventUrl}`,
      defac: {
        ...event.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${event?.defac?.name?.replace(/ /g, '-')}/${event?.defac
          ?.profilePicUrl}`,
      },
    }));
    new SuccessResponse('Fetched all events by defac', {
      eventList: updatedEvent,
    }).send(res);
  }),
);

router.get(
  '/single/:eventId',
  asyncHandler(async (req, res) => {
    const event = await EventRepo.getById(req.params.eventId);
    new SuccessResponse('Fetched menu by id', {
      ...event,
      eventUrl: `${process.env.SERVER_URL}/event/${event?.name?.replace(
        / /g,
        '-',
      )}-${event?.defac?._id}/${event?.eventUrl}`,
      defac: {
        ...event?.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${event?.defac?.name?.replace(/ /g, '-')}/${event?.defac
          ?.profilePicUrl}`,
      },
    }).send(res);
  }),
);

router.delete(
  '/:eventId',
  asyncHandler(async (req, res) => {
    const event = await EventRepo.getById(req.params.eventId);
    fs.rm(
      `uploads/event/${event?.name?.replace(/ /g, '-')}-${event?.defac._id}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
        console.log('Folder deleted!');
      },
    );
    const response = await EventRepo.deleteById(req.params.eventId);
    new SuccessResponse('Event deleted!', response).send(res);
  }),
);

router.patch(
  '/',
  upload.single('eventUrl'),
  asyncHandler(async (req, res) => {
    const response = await EventRepo.update({
      ...req.body,
      eventUrl: req.file?.filename,
    } as Event);
    new SuccessResponse('Event updated!', response).send(res);
  }),
);

export default router;
