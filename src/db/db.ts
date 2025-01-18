import mongoose from "mongoose";
import { dbConfig } from "./config";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;

export class DatabaseConnection {
  private static retryCount = 0;

  private static async connectWithRetry(): Promise<void> {
    try {
      if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in environment variables");
      }

      await mongoose.connect(process.env.MONGO_URL, dbConfig);
      console.log("Successfully connected to MongoDB Atlas");
      DatabaseConnection.retryCount = 0;
    } catch (error) {
      console.error("MongoDB connection error:", error);

      if (DatabaseConnection.retryCount < MAX_RETRIES) {
        DatabaseConnection.retryCount++;
        console.log(
          `Retrying connection attempt ${
            DatabaseConnection.retryCount
          } of ${MAX_RETRIES} in ${RETRY_INTERVAL / 1000} seconds...`
        );

        setTimeout(() => {
          DatabaseConnection.connectWithRetry();
        }, RETRY_INTERVAL);
      } else {
        console.error(
          "Max retry attempts reached. Please check your configuration."
        );
        throw error;
      }
    }
  }

  public static async connect(): Promise<void> {
    try {
      // Set up mongoose event listeners
      mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to MongoDB Atlas");
      });

      mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("Mongoose disconnected from MongoDB Atlas");
      });

      // Handle application termination
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      });

      await DatabaseConnection.connectWithRetry();
    } catch (error) {
      console.error("Failed to establish database connection:", error);
      process.exit(1);
    }
  }
}
