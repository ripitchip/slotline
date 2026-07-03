import mongoose, { model, Model, Document, Schema } from "mongoose";

export interface Time {
  start: number;
  end: number;
  ifNeedBe?: boolean;
}

export interface TimeFromDB {
  _id: string;
  start: number;
  end: number;
  ifNeedBe?: boolean;
}

export interface Vote {
  name: string;
  times: Time[];
}

export interface VoteFromDB {
  _id: string;
  name: string;
  times: TimeFromDB[];
}

export interface PublicTimeCount {
  start: number;
  end: number;
  yes: number;
  ifNeedBe: number;
  total: number;
}

export interface Poll {
  title?: string;
  description?: string;
  open?: boolean;
  secret: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
  location?: string;
  type?: string;
  times: Time[];
  finalTime?: Time;
  votes?: Vote[];
  step?: number;
  resultsVisibility?: "votes" | "count" | "nothing";
}

export interface PollFromDB {
  _id: string;
  title?: string;
  description?: string;
  open?: boolean;
  secret: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
  location?: string;
  type?: string;
  times: TimeFromDB[];
  finalTime?: TimeFromDB;
  votes?: VoteFromDB[];
  occupiedTimes?: TimeFromDB[];
  publicTimeCounts?: PublicTimeCount[];
  step?: number;
  resultsVisibility?: "votes" | "count" | "nothing";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PollDoc extends Document {
  title?: string;
  description?: string;
  open?: boolean;
  secret: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
  location?: string;
  type?: string;
  times: Time[];
  finalTime?: Time;
  votes?: Vote[];
  step?: number;
  resultsVisibility?: "votes" | "count" | "nothing";
}

const PollSchema: Schema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    open: { type: Boolean, default: true },
    secret: { type: String, required: true },
    ownerId: { type: String },
    ownerEmail: { type: String },
    ownerName: { type: String },
    location: { type: String },
    type: { type: String },
    step: { type: Number, default: 60 },
    resultsVisibility: { type: String, default: "votes" },
    times: {
      type: [{ start: Number, end: Number }],
      required: true,
    },
    finalTime: { type: { start: Number, end: Number } },
    votes: [
      {
        name: String,
        times: [{ start: Number, end: Number, ifNeedBe: Boolean }],
      },
    ],
  },
  { timestamps: true }
);

const SamayPoll: Model<PollDoc> =
  mongoose.models.Poll || model("Poll", PollSchema);

export interface HttpResponse {
  data: any;
  statusCode: number;
}

export default SamayPoll;
