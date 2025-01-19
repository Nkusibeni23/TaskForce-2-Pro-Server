import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../../../src/app";

dotenv.config();

// Add debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

export const handler = serverless(app, {
  binary: true,
  request: {
    response: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, clerk-token",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      },
    },
  },
});
