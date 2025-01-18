import mongoose from "mongoose";

interface ConnectionOptions extends mongoose.ConnectOptions {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
  serverSelectionTimeoutMS?: number;
  socketTimeoutMS?: number;
}

export const dbConfig: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
