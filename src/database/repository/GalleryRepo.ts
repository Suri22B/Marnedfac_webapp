import Gallery, { GalleryModel } from '../model/Gallery';

async function create(gallery: Gallery): Promise<Gallery> {
  const now = new Date();
  gallery.createdAt = gallery.updatedAt = now;
  const createdGallery = await GalleryModel.create(gallery);
  return createdGallery.toObject();
}

async function getAll(): Promise<Gallery[]> {
  return await GalleryModel.find()
    .select('+galleryUrl +folderName +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function getById(galleryId: string): Promise<Gallery | null> {
  return await GalleryModel.findById(galleryId)
    .select('+galleryUrl +folderName +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function deleteById(galleryId: string): Promise<{ isDeleted: boolean }> {
  await GalleryModel.findByIdAndDelete(galleryId);
  return { isDeleted: true };
}

async function update(gallery: Gallery): Promise<Gallery | null> {
  const now = new Date();
  gallery.updatedAt = now;
  return await GalleryModel.findByIdAndUpdate(gallery._id, gallery, {
    new: true,
  });
}

// async function findByGallery(galleryName: string): Promise<Gallery | null> {
//   return await GalleryModel.findOne({ title: galleryName })
//     .select('+title +createdBy')
//     .lean()
//     .exec();
// }

export default {
  create,
  getAll,
  getById,
  deleteById,
  update,
};
