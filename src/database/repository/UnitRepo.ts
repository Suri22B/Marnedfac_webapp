import Unit, { UnitModel } from '../model/Unit';

async function create(unit: Unit): Promise<Unit> {
  const now = new Date();
  unit.createdAt = unit.updatedAt = now;
  const createdUnit = await UnitModel.create(unit);
  return createdUnit.toObject();
}

async function getAll(): Promise<Unit[]> {
  return await UnitModel.find()
    .select('+name +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function getById(unitId: string): Promise<Unit | null> {
  return await UnitModel.findById(unitId)
    .select('+name +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function deleteById(unitId: string): Promise<{ isDeleted: boolean }> {
  await UnitModel.findByIdAndDelete(unitId);
  return { isDeleted: true };
}

async function update(unit: Unit): Promise<Unit | null> {
  const now = new Date();
  unit.updatedAt = now;
  return await UnitModel.findByIdAndUpdate(unit._id, unit, {
    new: true,
  });
}

async function findByUnit(unitName: string): Promise<Unit | null> {
  return await UnitModel.findOne({ name: unitName })
    .select('+name +createdBy')
    .lean()
    .exec();
}

export default {
  create,
  getAll,
  getById,
  deleteById,
  update,
  findByUnit,
};
