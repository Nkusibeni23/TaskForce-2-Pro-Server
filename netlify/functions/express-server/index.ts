import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../../../src/app";

dotenv.config();

// Debug route with full path
app.get("/.netlify/functions/express-server/api/v1/debug", (req, res) => {
  res.json({ message: "Debug endpoint working" });
});

// Additional debug route at root
app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
    routes: app._router.stack
      .filter((r) => r.route)
      .map((r) => ({
        path: r.route?.path,
        methods: Object.keys(r.route?.methods || {}),
      })),
  });
});

// Your existing middleware and logging
app.use((req, res, next) => {
  console.log("Request Details:", {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    headers: {
      authorization: req.headers.authorization ? "present" : "missing",
      "clerk-token": req.headers["clerk-token"] ? "present" : "missing",
    },
  });
  next();
});

export const handler = serverless(app, {
  request: {
    response: {
      headers: {
        "Access-Control-Allow-Origin":
          process.env.CLIENT_URL || "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, clerk-token",
        "Access-Control-Allow-Credentials": "true",
      },
    },
  },
});
