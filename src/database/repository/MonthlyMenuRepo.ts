import MonthlyMenu, { MonthlyMenuModel } from '../model/MonthlyMenu';

async function create(menu: MonthlyMenu): Promise<MonthlyMenu> {
  const now = new Date();
  menu.createdAt = menu.updatedAt = now;
  const createdMonthlyMenu = await MonthlyMenuModel.create(menu);
  return createdMonthlyMenu.toObject();
}

async function getAll(): Promise<MonthlyMenu[]> {
  return await MonthlyMenuModel.find({})
    .select('+menuUrl +defac +createdAt +updatedAt')
    .populate({ path: 'defac', select: 'name profilePicUrl' })
    .lean()
    .exec();
}

async function getAllMonthlyMenuByDefac(defacId: any): Promise<MonthlyMenu[]> {
  return await MonthlyMenuModel.find({ defac: defacId })
    .select('+menuUrl +defac +createdAt +updatedAt')
    .populate({ path: 'defac', select: 'name profilePicUrl' })
    .lean()
    .exec();
}

async function getLatestMonthlyMenuByDefac(defacId: any): Promise<MonthlyMenu | null> {
  return await MonthlyMenuModel.findOne({ defac: defacId })
    .sort({ createdAt: -1 })
    .select('+menuUrl +defac +createdAt +updatedAt')
    .populate({ path: 'defac', select: 'name profilePicUrl' })
    .lean()
    .exec();
}

async function getById(monthlyMenuId: string): Promise<MonthlyMenu | null> {
  return await MonthlyMenuModel.findById(monthlyMenuId)
    .select('+menuUrl +defac +createdAt +updatedAt')
    .populate({ path: 'defac', select: 'name profilePicUrl' })
    .lean()
    .exec();
}

async function deleteById(
  monthlyMenuId: string,
): Promise<{ isDeleted: boolean }> {
  await MonthlyMenuModel.findByIdAndDelete(monthlyMenuId);
  return { isDeleted: true };
}

async function update(monthlyMenu: MonthlyMenu): Promise<MonthlyMenu | null> {
  const now = new Date();
  monthlyMenu.updatedAt = now;
  return await MonthlyMenuModel.findByIdAndUpdate(
    monthlyMenu._id,
    monthlyMenu,
    {
      new: true,
    },
  );
}

async function findByMenu(
  menuName: string,
  defacId: string,
): Promise<MonthlyMenu | null> {
  return await MonthlyMenuModel.findOne({ name: menuName, defac: defacId })
    .select('+name +defac')
    .lean()
    .exec();
}

export default {
  create,
  getAll,
  getAllMonthlyMenuByDefac,
  getLatestMonthlyMenuByDefac,
  getById,
  deleteById,
  update,
  findByMenu
};
