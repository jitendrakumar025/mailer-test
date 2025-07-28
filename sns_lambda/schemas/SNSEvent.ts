import mongoose, { Schema, Document } from "mongoose";
import { SNSEventRecordModel, SNSEventRecordDoc } from "./SNSEventRecord";

const SNSEventSchema = new Schema(
  {
    Records: { type: [SNSEventRecordModel], required: true },
  },
  { timestamps: true }
);

export interface SNSEventDoc extends Document {
  Records: SNSEventRecordDoc[];
}

export const SNSEventModel = mongoose.model<SNSEventDoc>(
  "SNSEvent",
  SNSEventSchema
);
