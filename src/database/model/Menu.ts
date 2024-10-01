import { model, Schema, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Menu';
export const COLLECTION_NAME = 'menus';

export default interface Menus {
  _id: Types.ObjectId;
  name?: string;
  description?: string;
  menuUrl?: string;
  category?: string;
  colorCode?: string;
  isActiveToday?: boolean;
  defac: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Menus>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    menuUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
    },
    category: {
      type: Schema.Types.String,
      trim: true,
    },
    colorCode: {
      type: Schema.Types.String,
      trim: true,
    },
    defac: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    isActiveToday: {
      type: Schema.Types.Boolean,
      default: false,
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

// schema.index({ _id: 1 });
schema.index({ name: 1 });
schema.index({ description: 1 });

export const MenuModel = model<Menus>(DOCUMENT_NAME, schema, COLLECTION_NAME);
