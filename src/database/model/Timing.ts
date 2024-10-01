import { model, Schema, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Timing';
export const COLLECTION_NAME = 'timings';

export default interface Timing {
  _id: Types.ObjectId;
  foodType: string;
  createdBy: User;
  openingHour: string;
  closingHour: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Timing>(
  {
    foodType: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    openingHour: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    closingHour: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const TimingModel = model<Timing>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
