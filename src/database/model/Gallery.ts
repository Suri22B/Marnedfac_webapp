import { model, Schema, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Gallery';
export const COLLECTION_NAME = 'galleries';

export default interface Gallery {
  _id: Types.ObjectId;
  galleryUrl: string;
  createdBy: User;
  createdAt?: Date;
  updatedAt?: Date;
  folderName: string;
}

const schema = new Schema<Gallery>(
  {
    galleryUrl: {
      type: Schema.Types.String,
      trim: true,
      required: true,
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
    folderName: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

// schema.index({ _id: 1 });
schema.index({ title: 1 });

export const GalleryModel = model<Gallery>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
