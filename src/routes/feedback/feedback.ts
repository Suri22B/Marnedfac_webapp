import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import FeedbackRepo from '../../database/repository/FeedbackRepo';
import Feedback, { FeedbackModel } from '../../database/model/Feedback';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';
import { UserModel } from '../../database/model/User';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/',
  validator(schema.feedback),
  asyncHandler(async (req, res) => {
    const { postedBy, defac, rating, feedback } = req.body;

    const newFeedback = await FeedbackRepo.create({
      postedBy,
      defac,
      feedback,
      rating,
    } as Feedback);

    new SuccessResponse('Feedback posted Successfully!', {
      feedback: newFeedback,
    }).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const allFeedback = await FeedbackRepo.getAll();
    new SuccessResponse('Fetched all feedbacks', {
      feedbackList: allFeedback?.map((feedback) => ({
        ...feedback,
        postedBy: {
          ...feedback.postedBy,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/soldier/${feedback?.postedBy?.name?.replace(/ /g, '-')}-${feedback
            ?.postedBy?.contact}/${feedback?.postedBy?.profilePicUrl}`,
        },
        defac: {
          ...feedback.defac,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/profile/${feedback?.defac?.name?.replace(/ /g, '-')}/${feedback
            ?.defac?.profilePicUrl}`,
        },
      })),
    }).send(res);
  }),
);

router.get(
  '/defac',
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const allFeedback = await FeedbackRepo.getFeedbackByDefac(
      req.user?.defaultDefac._id,
    );
    new SuccessResponse('Fetched feedbacks of specific defac!', {
      feedbackList: allFeedback?.map((feedback) => ({
        ...feedback,
        postedBy: {
          ...feedback.postedBy,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/soldier/${feedback?.postedBy?.name?.replace(/ /g, '-')}-${feedback
            ?.postedBy?.contact}/${feedback?.postedBy?.profilePicUrl}`,
        },
        defac: {
          ...feedback.defac,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/profile/${feedback?.defac?.name?.replace(/ /g, '-')}/${feedback
            ?.defac?.profilePicUrl}`,
        },
      })),
    }).send(res);
  }),
);

router.get(
  '/:soldierId',
  asyncHandler(async (req, res) => {
    const allFeedback = await FeedbackRepo.getFeedbackBySoldier(
      req.params.soldierId,
    );
    new SuccessResponse('Fetched feedbacks by soldier', {
      feedbackList: allFeedback?.map((feedback) => ({
        ...feedback,
        postedBy: {
          ...feedback.postedBy,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/soldier/${feedback?.postedBy?.name?.replace(/ /g, '-')}-${feedback
            ?.postedBy?.contact}/${feedback?.postedBy?.profilePicUrl}`,
        },
        defac: {
          ...feedback.defac,
          profilePicUrl: `${
            process.env.SERVER_URL
          }/profile/${feedback?.defac?.name?.replace(/ /g, '-')}/${feedback
            ?.defac?.profilePicUrl}`,
        },
      })),
    }).send(res);
  }),
);

router.get(
  '/single/:feedbackId',
  asyncHandler(async (req, res) => {
    const feedback = await FeedbackRepo.getById(req.params.feedbackId);
    new SuccessResponse('Fetched feedback successfully!', {
      ...feedback,
      postedBy: {
        ...feedback?.postedBy,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/soldier/${feedback?.postedBy?.name?.replace(/ /g, '-')}-${feedback
          ?.postedBy?.contact}/${feedback?.postedBy?.profilePicUrl}`,
      },
      defac: {
        ...feedback?.defac,
        profilePicUrl: `${
          process.env.SERVER_URL
        }/profile/${feedback?.defac?.name?.replace(/ /g, '-')}/${feedback?.defac
          ?.profilePicUrl}`,
      },
    }).send(res);
  }),
);

router.delete(
  '/:feedbackId',
  asyncHandler(async (req, res) => {
    const response = await FeedbackRepo.deleteById(req.params.feedbackId);
    new SuccessResponse('Feedback deleted!', response).send(res);
  }),
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const response = await FeedbackRepo.update({
      _id: req.body.id,
      feedback: req.body.feedback,
      rating: req.body.rating,
    } as Feedback);
    new SuccessResponse('Feedback updated!', response).send(res);
  }),
);

export default router;
