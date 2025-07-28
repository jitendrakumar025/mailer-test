import mongoose, { Schema, Document } from "mongoose";

const SNSMessageAttributeSchema = new Schema(
  {
    Type: { type: String, required: true },
    Value: { type: String, required: true },
  },
  { _id: false }
);

const SNSMessageSchema = new Schema(
  {
    SignatureVersion: { type: String, required: true },
    Timestamp: { type: String, required: true },
    Signature: { type: String, required: true },
    SigningCertUrl: { type: String, required: true },
    MessageId: { type: String, required: true, index: true, unique: true },
    Message: { type: String, required: true },
    MessageAttributes: {
      type: Map,
      of: SNSMessageAttributeSchema,
      default: {},
    },
    Type: { type: String, required: true },
    UnsubscribeUrl: { type: String, required: true },
    TopicArn: { type: String, required: true },
    Subject: { type: String },
    Token: { type: String },
  },
  { _id: false }
);

const SNSEventRecordSchema = new Schema(
  {
    EventVersion: { type: String, required: true },
    EventSubscriptionArn: { type: String, required: true },
    EventSource: { type: String, required: true },
    Sns: { type: SNSMessageSchema, required: true },
  },
  { timestamps: true }
); // optional timestamps

export interface SNSMessageAttributeDoc {
  Type: string;
  Value: string;
}

export interface SNSMessageDoc {
  SignatureVersion: string;
  Timestamp: string;
  Signature: string;
  SigningCertUrl: string;
  MessageId: string;
  Message: string;
  MessageAttributes: Record<string, SNSMessageAttributeDoc>;
  Type: string;
  UnsubscribeUrl: string;
  TopicArn: string;
  Subject?: string;
  Token?: string;
}

export interface SNSEventRecordDoc extends Document {
  EventVersion: string;
  EventSubscriptionArn: string;
  EventSource: string;
  Sns: SNSMessageDoc;
}

export const SNSEventRecordModel = mongoose.model<SNSEventRecordDoc>(
  "SNSEventRecord",
  SNSEventRecordSchema
);
