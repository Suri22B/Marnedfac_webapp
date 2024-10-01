import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import TimingRepo from '../../database/repository/TimingRepo';
import Timing from '../../database/model/Timing';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import { BadRequestError } from '../../core/ApiError';
import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';

const router = express.Router();

router.post(
  '/',
  validator(schema.timing),
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const existingTiming = await TimingRepo.findByFoodType(
      req.user?._id,
      req.body.foodType,
    );
    if (existingTiming) throw new BadRequestError('Timing already added!');
    const timing = await TimingRepo.create({
      ...req.body,
      createdBy: req.user?._id,
    } as Timing);
    new SuccessResponse('Timing added Successfully!', timing).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const timingList = await TimingRepo.getAll();
    new SuccessResponse('Fetched all timing', timingList).send(res);
  }),
);

router.get(
  '/defac',
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const timingList = await TimingRepo.getByDefac(req.user?._id);
    new SuccessResponse('Fetched all timing by defac', timingList).send(res);
  }),
);

router.get(
  '/defaultDefac',
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const timingList = await TimingRepo.getByDefac(req.user?.defaultDefac?._id);
    new SuccessResponse('Fetched all timing by default defac', timingList).send(res);
  }),
);

router.get(
  '/defac/:defacId',
  asyncHandler(async (req: UserRequest, res) => {
    const timingList = await TimingRepo.getByDefac(req.params.defacId);
    new SuccessResponse('Fetched all timing by defac', timingList).send(res);
  }),
);

router.get(
  '/:timingId',
  asyncHandler(async (req, res) => {
    const timing = await TimingRepo.getById(req.params.timingId);
    new SuccessResponse('Fetched timing by id', timing).send(res);
  }),
);

router.delete(
  '/:timingId',
  asyncHandler(async (req, res) => {
    const response = await TimingRepo.deleteById(req.params.timingId);
    new SuccessResponse('Timing deleted', response).send(res);
  }),
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const updatedTiming = await TimingRepo.update({
      ...req.body,
      _id: req.body.id,
    });
    new SuccessResponse('Timing updated', updatedTiming).send(res);
  }),
);

export default router;
