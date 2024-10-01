import { EventsModel } from '../model/Event';
import { FeedbackModel } from '../model/Feedback';
import { MenuModel } from '../model/Menu';
import { MonthlyMenuModel } from '../model/MonthlyMenu';
import { OrderModel } from '../model/Order';
import { RoleCode } from '../model/Role';
import User, { UserModel } from '../model/User';

async function create(defac: User, role: string): Promise<User> {
  const now = new Date();
  defac.createdAt = defac.updatedAt = now;
  defac.role = role;
  const createdDefac = await UserModel.create(defac);
  return createdDefac.toObject();
}

async function getAllDefacByPosts(post: string): Promise<User[]> {
  return await UserModel.find({ role: RoleCode.DEFAC, post })
    .select(
      '+name +email +contact +profilePicUrl +coverPicUrl +role +post +openingHour +closingHour +status +createdAt +updatedAt',
    )
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
    .lean()
    .exec();
}

async function getAll(): Promise<User[]> {
  return await UserModel.find({ role: RoleCode.DEFAC })
    .select(
      '+name +email +contact +profilePicUrl +coverPicUrl +role +post +openingHour +closingHour +status +createdAt +updatedAt',
    )
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
    .lean()
    .exec();
}

async function findByEmail(email: string): Promise<User | null> {
  return await UserModel.findOne({ email })
    .select('+email +name +contact +address')
    .lean()
    .exec();
}

async function getById(defacId: string | undefined): Promise<User | null> {
  return await UserModel.findById(defacId)
    .select(
      '+name +email +contact +profilePicUrl +coverPicUrl +role +post +openingHour +closingHour +status +createdAt +updatedAt',
    )
    .lean()
    .exec();
}

async function deleteById(defacId: string): Promise<{ isDeleted: boolean }> {
  await UserModel.findByIdAndDelete(defacId);
  await MenuModel.deleteMany({ defac: defacId });
  await EventsModel.deleteMany({ defac: defacId });
  await MonthlyMenuModel.deleteMany({ defac: defacId });
  await FeedbackModel.deleteMany({ defac: defacId });
  await OrderModel.deleteMany({ defac: defacId });
  return { isDeleted: true };
}

async function update(defac: User): Promise<User | null> {
  const now = new Date();
  defac.updatedAt = now;
  return await UserModel.findByIdAndUpdate(defac._id, defac, {
    new: true,
  });
}

export default {
  create,
  getAll,
  findByEmail,
  getById,
  deleteById,
  update,
  getAllDefacByPosts,
};
