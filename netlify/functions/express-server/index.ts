import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../../../src/app";
import { DatabaseConnection } from "../../../src/db/db";

dotenv.config();

// Debug middleware
app.use((req, res, next) => {
  console.log("Request:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    userId: req.auth?.userId,
  });
  next();
});

let isConnected = false;

const handler = async (event, context) => {
  // Make database connection reusable across function invocations
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    try {
      await DatabaseConnection.connect();
      isConnected = true;
      console.log("Database connected");
    } catch (error) {
      console.error("Database connection failed:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Database connection failed" }),
      };
    }
  }

  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

export { handler };
