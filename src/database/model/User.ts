import { model, Schema, Types } from 'mongoose';
import Role from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id: Types.ObjectId;
  name?: string;
  profilePicUrl?: string;
  coverPicUrl?: string;
  email?: string;
  contact?: number;
  password?: string;
  address?: string;
  role: string;
  unit: string;
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  verificationToken?: String;
  resetPasswordToken?: String;
  resetPasswordExpires?: Number;
  openingHour?: string;
  closingHour?: string;
  post: string;
  rank: string;
  defaultDefac?: User;
}

const schema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    coverPicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      sparse: true, // allows null
      trim: true,
      select: false,
    },
    contact: {
      type: Schema.Types.Number,
      unique: true,
      sparse: true, // allows null
      select: false,
    },
    address: {
      type: Schema.Types.String,
      sparse: true, // allows null
      trim: true,
      select: false,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    role: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
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
    openingHour: {
      type: Schema.Types.String,
      required: false,
      select: false,
    },
    closingHour: {
      type: Schema.Types.String,
      required: false,
      select: false,
    },
    post: {
      type: Schema.Types.String,
      // required: true,
      trim: true,
      select: false,
    },
    unit: {
      type: Schema.Types.String,
      // required: true,
      trim: true,
      select: false,
    },
    verificationToken: {
      type: Schema.Types.String,
      trim: true,
      select: false,
    },
    resetPasswordToken: {
      type: Schema.Types.String,
      trim: true,
      select: false,
    },
    resetPasswordExpires: {
      type: Number,
      required: false,
      select: false,
    },
    rank: {
      type: Schema.Types.String,
      // required: true,
      trim: true,
      select: false,
    },
    defaultDefac: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
