import Banner, { BannerModel } from '../model/Banner';

async function create(banner: Banner): Promise<Banner> {
  const now = new Date();
  banner.createdAt = banner.updatedAt = now;
  const createdBanner = await BannerModel.create(banner);
  return createdBanner.toObject();
}

async function getAll(): Promise<Banner[]> {
  return await BannerModel.find()
    .select('+title +bannerUrl +folderName +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function getById(bannerId: string): Promise<Banner | null> {
  return await BannerModel.findById(bannerId)
    .select('+title +bannerUrl +folderName +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function deleteById(bannerId: string): Promise<{ isDeleted: boolean }> {
  await BannerModel.findByIdAndDelete(bannerId);
  return { isDeleted: true };
}

async function update(banner: Banner): Promise<Banner | null> {
  const now = new Date();
  banner.updatedAt = now;
  return await BannerModel.findByIdAndUpdate(banner._id, banner, {
    new: true,
  });
}

async function findByBanner(bannerName: string): Promise<Banner | null> {
  return await BannerModel.findOne({ title: bannerName })
    .select('+title +createdBy')
    .lean()
    .exec();
}

export default {
  create,
  getAll,
  getById,
  deleteById,
  update,
  findByBanner,
};
