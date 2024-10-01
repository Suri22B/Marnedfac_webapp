import User, { UserModel } from '../model/User';
import { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { OrderModel } from '../model/Order';
import { FeedbackModel } from '../model/Feedback';

async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null && user !== undefined;
}

async function findPrivateProfileById(
  id: string | Types.ObjectId,
): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select(
      '+email +name +profilePicUrl +rank +post +unit +contact +defaultDefac',
    )
    .populate({ path: 'defaultDefac', select: '_id name' })
    .populate({
      path: 'role',
      match: { status: true },
      select: { code: 1 },
    })
    .lean<User>()
    .exec();
}

async function deleteProfileById(
  userId: Types.ObjectId,
): Promise<{ isDeleted: boolean }> {
  await UserModel.findByIdAndDelete(userId);
  await FeedbackModel.deleteMany({ postedBy: userId });
  await OrderModel.deleteMany({ orderedBy: userId });
  return { isDeleted: true };
}

// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select(
      '+email +name +profilePicUrl +rank +post +unit +contact +defaultDefac',
    )
    .populate({ path: 'defaultDefac', select: '_id name' })
    .lean()
    .exec();
}

async function findByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ email: email })
    .select('+email +password +role +name +profilePicUrl +defaultDefac')
    .lean()
    .exec();
}

async function findByEmailVerified(email: string): Promise<User | null> {
  return UserModel.findOne({ email: email, verified: true })
    .select('+email +password +role +name +profilePicUrl +defaultDefac')
    .lean()
    .exec();
}

async function findFieldsById(
  id: Types.ObjectId,
  ...fields: string[]
): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }, [...fields])
    .lean()
    .exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }).lean().exec();
}

async function findByVerificationToken(token: String): Promise<User | null> {
  return UserModel.findOne({ verificationToken: token }).lean().exec();
}

async function findByResetToken(token: String): Promise<User | null> {
  return UserModel.findOne({ resetPasswordToken: token }).lean().exec();
}

async function create(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
  role: string,
): Promise<{ user: User; keystore: Keystore }> {
  const now = new Date();

  if (!role) throw new InternalError('Role must be defined');

  user.role = role;
  user.createdAt = user.updatedAt = now;
  const createdUser = await UserModel.create(user);
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );
  return {
    user: { ...createdUser.toObject() },
    keystore: keystore,
  };
}

async function update(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
  user.updatedAt = new Date();
  await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
  const keystore = await KeystoreRepo.create(
    user,
    accessTokenKey,
    refreshTokenKey,
  );
  return { user: user, keystore: keystore };
}

async function updateInfo(user: User): Promise<any> {
  user.updatedAt = new Date();
  return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
}

export default {
  exists,
  findPrivateProfileById,
  findById,
  findByEmail,
  findFieldsById,
  findPublicProfileById,
  create,
  update,
  updateInfo,
  findByVerificationToken,
  findByResetToken,
  findByEmailVerified,
  deleteProfileById,
};
