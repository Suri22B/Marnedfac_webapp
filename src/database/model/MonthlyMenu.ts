import { model, Schema, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'MonthlyMenu';
export const COLLECTION_NAME = 'monthlyMenus';

export default interface MonthlyMenu {
  _id: Types.ObjectId;
  menuUrl?: string;
  defac: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<MonthlyMenu>(
  {
    menuUrl: {
      type: Schema.Types.String,
      trim: true,
    },

    defac: {
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

export const MonthlyMenuModel = model<MonthlyMenu>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
