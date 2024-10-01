import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import UnitRepo from '../../database/repository/UnitRepo';
import Unit from '../../database/model/Unit';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import { BadRequestError } from '../../core/ApiError';
import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';
import User, { UserModel } from '../../database/model/User';

const router = express.Router();

router.post(
  '/',
  validator(schema.unit),
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const existingUnit = await UnitRepo.findByUnit(req.body.name);
    if (existingUnit) throw new BadRequestError('Unit already added!');
    const unit = await UnitRepo.create({
      ...req.body,
      createdBy: req.user?._id,
    } as Unit);
    new SuccessResponse('Unit added Successfully!', unit).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const unitList = await UnitRepo.getAll();
    new SuccessResponse('Fetched all unit', unitList).send(res);
  }),
);

router.get(
  '/:unitId',
  asyncHandler(async (req, res) => {
    const unit = await UnitRepo.getById(req.params.unitId);
    new SuccessResponse('Fetched unit by id', unit).send(res);
  }),
);

router.delete(
  '/:unitId',
  asyncHandler(async (req, res) => {
    const unit = await UnitRepo.getById(req.params.unitId);

    // get all soldier list where the post is selected post for the soldier
    const selectedUnitSoldier = await UserModel.find({
      unit: unit?.name,
    })
      .select(
        '+email +name +profilePicUrl +rank +post +unit +contact +defaultDefac',
      )
      .lean()
      .exec();

    // get all post list
    const unitList = await UnitRepo.getAll();

    // replace the selected post for the soldier
    await Promise.all(
      selectedUnitSoldier?.map(async (soldier: User) => {
        const randomUnit = unitList.find((unit) => unit.name !== soldier.unit);
        return await UserModel.findByIdAndUpdate(
          soldier._id,
          { unit: randomUnit?.name },
          {
            new: true,
          },
        );
      }),
    );

    // delete unit
    const response = await UnitRepo.deleteById(req.params.unitId);
    new SuccessResponse('Unit deleted', response).send(res);
  }),
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const updatedUnit = await UnitRepo.update({
      ...req.body,
      _id: req.body.id,
    });
    new SuccessResponse('Unit updated', updatedUnit).send(res);
  }),
);

export default router;
