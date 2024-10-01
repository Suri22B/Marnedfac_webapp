import { Schema, model, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Feedback';
export const COLLECTION_NAME = 'feedbacks';

export default interface Feedback {
  _id: Types.ObjectId;
  postedBy: User;
  defac: User;
  feedback: string;
  rating?: number;
  postedAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Feedback>(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    defac: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    feedback: {
      type: Schema.Types.String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    rating: {
      type: Schema.Types.Number,
      required: true,
      trim: true,
    },
    postedAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index(
  { feedback: 'text', rating: 'text' },
  { weights: { feedback: 1, rating: 1 }, background: false },
);
schema.index({ _id: 1, status: 1 });

export const FeedbackModel = model<Feedback>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
