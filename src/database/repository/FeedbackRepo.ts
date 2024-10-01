import Feedback, { FeedbackModel } from '../model/Feedback';

async function create(feedback: Feedback): Promise<Feedback> {
  const now = new Date();
  feedback.postedAt = feedback.updatedAt = now;
  const postedFeedback = await FeedbackModel.create(feedback);
  return postedFeedback.toObject();
}

async function getAll(): Promise<Feedback[]> {
  return await FeedbackModel.find()
    .select('+postedBy +defac +feedback +rating +postedAt +updatedAt')
    .populate({ path: 'postedBy', select: 'name profilePicUrl contact post' })
    .populate({ path: 'defac', select: 'name profilePicUrl contact' })
    .lean()
    .exec();
}

async function getFeedbackBySoldier(soldierId: string): Promise<Feedback[]> {
  return await FeedbackModel.find({ postedBy: soldierId })
    .select('+postedBy +defac +feedback +rating +postedAt +updatedAt')
    .populate({ path: 'postedBy', select: 'name profilePicUrl contact post' })
    .populate({ path: 'defac', select: 'name profilePicUrl contact' })
    .lean()
    .exec();
}

async function getFeedbackByDefac(defacId: any): Promise<Feedback[]> {
  return await FeedbackModel.find({ defac: defacId })
    .select('+postedBy +defac +feedback +rating +postedAt +updatedAt')
    .populate({
      path: 'postedBy',
      select: '_id name profilePicUrl contact post',
    })
    .populate({ path: 'defac', select: '_id name profilePicUrl contact' })
    .lean()
    .exec();
}

async function getById(feedbackId: string) {
  return await FeedbackModel.findById(feedbackId)
    .select('+postedBy +defac +feedback +rating +postedAt +updatedAt')
    .populate({ path: 'defac', select: '_id name profilePicUrl contact' })
    .populate({
      path: 'postedBy',
      select: '_id name profilePicUrl contact post',
    })
    .lean()
    .exec();
}

async function deleteById(feedbackId: string): Promise<{ isDeleted: boolean }> {
  await FeedbackModel.findByIdAndDelete(feedbackId);
  return { isDeleted: true };
}

async function update(feedback: Feedback): Promise<Feedback | null> {
  const now = new Date();
  feedback.updatedAt = now;
  return await FeedbackModel.findByIdAndUpdate(feedback._id, feedback, {
    new: true,
  });
}

export default {
  create,
  getAll,
  getFeedbackBySoldier,
  getById,
  deleteById,
  update,
  getFeedbackByDefac,
};
