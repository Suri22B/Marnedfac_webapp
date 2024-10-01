import Events, { EventsModel } from '../model/Event';

async function create(event: any): Promise<Events> {
  const now = new Date();
  event.createdAt = event.updatedAt = now;
  event.startDate = new Date(event.startDate).toISOString();
  event.endDate = new Date(event.endDate).toISOString();
  const createdEvent = await EventsModel.create(event);
  return createdEvent.toObject();
}

async function getAll(): Promise<Events[]> {
  return await EventsModel.find({})
    .select(
      '+name +description +eventUrl +defac +startDate +endDate +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl contact' })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
    .lean()
    .exec();
}

async function getUpcomingEvents(): Promise<Events[]> {
  const currentDate = new Date().toISOString();
  return await EventsModel.find({
    startDate: { $gt: currentDate }, // Filter events where startDate is greater than the current date
  })
    .select(
      '+name +description +eventUrl +defac +startDate +endDate +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl contact' })
    .sort({ currentDate: -1 }) // Sort by createdAt in descending order (most recent first)
    .lean()
    .exec();
}

async function getAllEventsByDefac(defacId: any): Promise<Events[]> {
  return await EventsModel.find({ defac: defacId })
    .select(
      '+name +description +eventUrl +defac +startDate +endDate +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl' })
    .lean()
    .exec();
}

async function getById(eventId: string): Promise<Events | null> {
  return await EventsModel.findById(eventId)
    .select(
      '+name +description +eventUrl +defac +startDate +endDate +createdAt +updatedAt',
    )
    .populate({ path: 'defac', select: '_id name profilePicUrl contact' })
    .lean()
    .exec();
}

async function deleteById(eventId: string): Promise<{ isDeleted: boolean }> {
  await EventsModel.findByIdAndDelete(eventId);
  return { isDeleted: true };
}

async function update(event: Events): Promise<Events | null> {
  const now = new Date();
  event.updatedAt = now;
  return await EventsModel.findByIdAndUpdate(event._id, event, {
    new: true,
  });
}

async function findByEvent(
  eventName: string,
  defacId: string,
): Promise<Events | null> {
  return await EventsModel.findOne({ name: eventName, defac: defacId })
    .select('+name +category +description +defac +startDate +endDate')
    .lean()
    .exec();
}

export default {
  create,
  getAll,
  getAllEventsByDefac,
  getById,
  deleteById,
  update,
  findByEvent,
  getUpcomingEvents,
};
