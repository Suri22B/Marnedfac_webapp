import Menus, { MenuModel } from '../model/Menu';

async function create(event: Menus): Promise<Menus> {
  const now = new Date();
  event.createdAt = event.updatedAt = now;
  const createdMenu = await MenuModel.create(event);
  return createdMenu.toObject();
}

async function getAll(): Promise<Menus[]> {
  return await MenuModel.find()
    .select(
      '+name +description +category +menuUrl +colorCode +defac +isActiveToday +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl' })
    .lean()
    .exec();
}

async function getAllMenusByDefacs(defacId: any): Promise<Menus[]> {
  return await MenuModel.find({ defac: defacId, isActiveToday: true })
    .select(
      '+name +description +category +menuUrl +colorCode +defac +isActiveToday +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl' })
    .lean()
    .exec();
}

async function getAllMenusByDefacsList(defacId: any): Promise<Menus[]> {
  return await MenuModel.find({ defac: defacId })
    .select(
      '+name +description +category +menuUrl +colorCode +defac +isActiveToday +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl' })
    .lean()
    .exec();
}

async function getById(menuId: string): Promise<Menus | null> {
  return await MenuModel.findById(menuId)
    .select(
      '+name +description +category +menuUrl +colorCode +defac +isActiveToday +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl' })
    .lean()
    .exec();
}

async function deleteById(menuId: string): Promise<{ isDeleted: boolean }> {
  await MenuModel.findByIdAndDelete(menuId);
  return { isDeleted: true };
}

async function update(menu: Menus): Promise<Menus | null> {
  const now = new Date();
  menu.updatedAt = now;
  return await MenuModel.findByIdAndUpdate(menu._id, menu, {
    new: true,
  });
}

async function findByMenu(
  menuName: string,
  defacId: string,
): Promise<Menus | null> {
  return await MenuModel.findOne({ name: menuName, defac: defacId })
    .select('+name +category +description +defac +colorCode')
    .lean()
    .exec();
}

export default {
  create,
  getAll,
  getAllMenusByDefacs,
  getAllMenusByDefacsList,
  getById,
  deleteById,
  update,
  findByMenu,
};
