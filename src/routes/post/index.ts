import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import PostRepo from '../../database/repository/PostRepo';
import Post from '../../database/model/Post';
import validator from '../../helpers/validator';
import schema from '../access/schema';
import { BadRequestError } from '../../core/ApiError';
import authentication from '../../auth/authentication';
import { UserRequest } from '../../types/app-request';
import User, { UserModel } from '../../database/model/User';

const router = express.Router();

router.post(
  '/',
  validator(schema.post),
  authentication,
  asyncHandler(async (req: UserRequest, res) => {
    const existingPost = await PostRepo.findByPost(req.body.name);
    if (existingPost) throw new BadRequestError('Post already added!');
    const post = await PostRepo.create({
      ...req.body,
      createdBy: req.user?._id,
    } as Post);
    new SuccessResponse('Post added Successfully!', post).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const postList = await PostRepo.getAll();
    new SuccessResponse('Fetched all post', postList).send(res);
  }),
);

router.get(
  '/:postId',
  asyncHandler(async (req, res) => {
    const post = await PostRepo.getById(req.params.postId);
    new SuccessResponse('Fetched post by id', post).send(res);
  }),
);

router.delete(
  '/:postId',
  asyncHandler(async (req, res) => {
    const post = await PostRepo.getById(req.params.postId);

    // get all soldier list where the post is selected post for the soldier
    const selectedPostSoldier = await UserModel.find({
      post: post?.name,
    })
      .select(
        '+email +name +profilePicUrl +rank +post +unit +contact +defaultDefac',
      )
      .lean()
      .exec();

    // get all post list
    const postList = await PostRepo.getAll();

    // replace the selected post for the soldier
    await Promise.all(
      selectedPostSoldier?.map(async (soldier: User) => {
        const randomPost = postList.find((post) => post.name !== soldier.post);
        return await UserModel.findByIdAndUpdate(
          soldier._id,
          { post: randomPost?.name },
          {
            new: true,
          },
        );
      }),
    );

    // delete post
    const response = await PostRepo.deleteById(req.params.postId);
    new SuccessResponse('Post deleted', response).send(res);
  }),
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const updatedPost = await PostRepo.update({
      ...req.body,
      _id: req.body.id,
    });
    new SuccessResponse('Post updated', updatedPost).send(res);
  }),
);

export default router;
