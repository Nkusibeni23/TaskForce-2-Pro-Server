import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../../../src/app";

dotenv.config();

// Add request logging middleware
app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    auth: req.auth,
  });
  next();
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export const handler = serverless(app, {
  request: {
    // Add CORS headers
    response: {
      headers: {
        "Access-Control-Allow-Origin":
          process.env.CLIENT_URL || "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, clerk-token",
        "Access-Control-Allow-Credentials": "true",
      },
    },
  },
});
