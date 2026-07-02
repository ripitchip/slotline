import mongoose, { ConnectOptions } from "mongoose";

const { NEXT_MONGODB_URI } = process.env;

mongoose.set("strictQuery", true);

const options: ConnectOptions = {
  autoIndex: true,
};

const connectToDatabase = (): Promise<typeof import("mongoose")> =>
  mongoose.connect(NEXT_MONGODB_URI, options);

export default connectToDatabase;
