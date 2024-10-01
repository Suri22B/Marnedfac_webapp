import { model, Schema, Types } from 'mongoose';
import User from './User';
import Menu from './Menu';

export const DOCUMENT_NAME = 'Order';
export const COLLECTION_NAME = 'orders';

export default interface Order {
  _id: Types.ObjectId;
  name?: string;
  orderedBy: User;
  orderedMenu: Menu;
  defac: User;
  quantity: Number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: boolean;
  orderStatus?: string;
  pickupTime: string;
  orderId: string;
}

const schema = new Schema<Order>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    orderedMenu: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
      select: false,
    },
    defac: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    quantity: {
      type: Schema.Types.Number,
      trim: true,
    },
    status: {
      type: Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
      default: new Date(),
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
      default: new Date(),
    },
    pickupTime: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    orderId: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    orderStatus: {
      type: Schema.Types.String,
      default: 'PROCESSING',
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const OrderModel = model<Order>(DOCUMENT_NAME, schema, COLLECTION_NAME);
