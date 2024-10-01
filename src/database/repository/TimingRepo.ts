import Timing, { TimingModel } from '../model/Timing';

async function create(timing: Timing): Promise<Timing> {
  const now = new Date();
  timing.createdAt = timing.updatedAt = now;
  const createdTiming = await TimingModel.create(timing);
  return createdTiming.toObject();
}

async function getAll(): Promise<Timing[]> {
  return await TimingModel.find()
    .select(
      '+foodType +createdBy +openingHour +closingHour +createdAt +updatedAt',
    )
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function getById(timingId: string): Promise<Timing | null> {
  return await TimingModel.findById(timingId)
    .select(
      '+foodType +createdBy +openingHour +closingHour +createdAt +updatedAt',
    )
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function getByDefac(
  defacId: string | undefined,
): Promise<Timing[] | null> {
  return await TimingModel.find({ createdBy: defacId })
    .select(
      '+foodType +createdBy +openingHour +closingHour +createdAt +updatedAt',
    )
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function deleteById(timingId: string): Promise<{ isDeleted: boolean }> {
  await TimingModel.findByIdAndDelete(timingId);
  return { isDeleted: true };
}

async function update(timing: Timing): Promise<Timing | null> {
  const now = new Date();
  timing.updatedAt = now;
  return await TimingModel.findByIdAndUpdate(timing._id, timing, {
    new: true,
  });
}

async function findByFoodType(
  defacId: string | undefined,
  foodType: string,
): Promise<Timing | null> {
  return await TimingModel.findOne({ createdBy: defacId, foodType: foodType })
    .select('+foodType +createdBy')
    .lean()
    .exec();
}

export default {
  create,
  getAll,
  getById,
  getByDefac,
  deleteById,
  update,
  findByFoodType,
};
