import Order, { OrderModel } from '../model/Order';

async function create(order: Order): Promise<Order> {
  const now = new Date();
  order.createdAt = order.updatedAt = now;
  const createdOrder = await OrderModel.create(order);

  // Populate the references before returning
  const populatedOrder = await (
    await (await createdOrder.populate('orderedBy')).populate('orderedMenu')
  ).populate('defac');

  return populatedOrder.toObject();
}

async function getAll(): Promise<Order[]> {
  return await OrderModel.find()
    .select(
      '+orderedBy +orderedMenu +quantity +createdAt +updatedAt +status +pickupTime +orderId',
    )
    .populate({ path: 'orderedBy', select: '_id name' })
    .populate({ path: 'defac', select: '_id name' })
    .populate({ path: 'orderedMenu', select: '_id name description category' })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function getById(orderId: string): Promise<Order | null> {
  return await OrderModel.findById(orderId)
    .select(
      '+orderedBy +orderedMenu +quantity +createdAt +updatedAt +status +pickupTime +orderId',
    )
    .populate({ path: 'orderedBy', select: '_id name +email' })
    .populate({ path: 'defac', select: '_id name' })
    .populate({ path: 'orderedMenu', select: '_id name description category' })
    .lean()
    .exec();
}

async function deleteById(orderId: string): Promise<{ isDeleted: boolean }> {
  await OrderModel.findByIdAndDelete(orderId);
  return { isDeleted: true };
}

async function getByDefac(defacId: string): Promise<Order[] | null> {
  return await OrderModel.find({ defac: defacId })
    .select(
      '+orderedBy +orderedMenu +quantity +createdAt +updatedAt +status +pickupTime +orderId +orderStatus',
    )
    .populate({ path: 'orderedBy', select: '_id name unit' })
    .populate({ path: 'defac', select: '_id name' })
    .populate({ path: 'orderedMenu', select: '_id name description category' })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function getBySoldier(
  soldierId: string | undefined,
): Promise<Order[] | null> {
  return await OrderModel.find({ orderedBy: soldierId })
    .select(
      '+orderedBy +orderedMenu +quantity +createdAt +updatedAt +status +pickupTime +orderId',
    )
    .populate({ path: 'orderedBy', select: '_id name' })
    .populate({ path: 'defac', select: '_id name' })
    .populate({ path: 'orderedMenu', select: '_id name description category' })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findByMenu(
  menuId: string,
  soldierId: string | undefined,
): Promise<Order | null> {
  return await OrderModel.findOne({ orderedMenu: menuId, orderedBy: soldierId })
    .select('+orderedMenu +orderedBy +quantity')
    .lean()
    .exec();
}

async function updateOrdersStatus(
  orderId: string,
  newStatus: string,
): Promise<any> {
  const now = new Date();
  await OrderModel.updateMany(
    { orderId }, // filter by orderId
    {
      $set: {
        orderStatus: newStatus.toUpperCase(), // update the status
        updatedAt: now, // update the timestamp
      },
    },
    { new: true },
  );
  return await OrderModel.find({ orderId }).populate({
    path: 'orderedBy',
    select: '_id name email',
  }); // fetch all updated orders
}

async function updateById(
  existingOrder: Object,
  updatedQuantity: number,
): Promise<Order | null> {
  return await OrderModel.findOneAndUpdate(
    { _id: existingOrder },
    { $set: { quantity: updatedQuantity } },
    { new: true },
  )
    .select('+orderedMenu +orderedBy +defac +quantity')
    .lean()
    .exec();
}

export default {
  create,
  findByMenu,
  getAll,
  getById,
  deleteById,
  getByDefac,
  getBySoldier,
  updateById,
  updateOrdersStatus,
};
