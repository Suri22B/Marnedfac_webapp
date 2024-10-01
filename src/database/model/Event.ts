import { model, Schema, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Event';
export const COLLECTION_NAME = 'events';

export default interface Event {
  _id: Types.ObjectId;
  name?: string;
  description?: string;
  eventUrl?: string;
  startDate?: string;
  endDate?: string;
  defac: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Event>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    eventUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
    },
    defac: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    startDate: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    endDate: {
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

// schema.index({ _id: 1 });
schema.index({ name: 1 });
schema.index({ description: 1 });

export const EventsModel = model<Event>(DOCUMENT_NAME, schema, COLLECTION_NAME);
