import { model, Schema, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Unit';
export const COLLECTION_NAME = 'units';

export default interface Unit {
  _id: Types.ObjectId;
  name?: string;
  createdBy: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Unit>(
  {
    name: {
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

export const UnitModel = model<Unit>(DOCUMENT_NAME, schema, COLLECTION_NAME);
