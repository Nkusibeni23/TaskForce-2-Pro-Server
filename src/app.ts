import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerConfig";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

// Import routers explicitly
import accountRouter from "./routers/accountRouter";
import budgetRouter from "./routers/budgetRouter";
import categoryRouter from "./routers/categoryRouter";
import expenseRouter from "./routers/expenseRouter";
import incomeRouter from "./routers/incomeRouter";
import notificationRouter from "./routers/notificationRoutes";
import transactionReportRouter from "./routers/transactionReportRoutes";
import transactionRouter from "./routers/transactionRoutes";
import mongoose from "mongoose";

const app = express();
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "clerk-token"],
  })
);

// router
app.get("/debug", (req, res) => {
  res.json({ message: "Debug endpoint working" });
});

// Add this before mounting routes
console.log("=== Starting Route Registration ===");

// Debug route at root level
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongoStatus: mongoose.connection.readyState,
    environment: process.env.NODE_ENV,
  });
});

// Log middleware stack before mounting routers
console.log("Middleware stack before mounting:", app._router.stack.length);

// Mount routers with logging
console.log("Mounting budget router...");
app.use("/api/v1", budgetRouter);
console.log("Budget router mounted");

// At the top of your routes
app.get("/debug-routes", (req, res) => {
  const routes = app._router.stack
    .filter((layer: any) => layer.route)
    .map((layer: any) => ({
      path: layer.route?.path,
      methods: Object.keys(layer.route?.methods || {}),
    }));

  res.json({
    totalRoutes: routes.length,
    routes,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      mongoConnected: mongoose.connection.readyState === 1,
    },
  });
});

// Add route debugging
app.use("/api/v1", (req, res, next) => {
  console.log("API route hit:", req.path);
  next();
});
app.use("/api/v1", accountRouter);
app.use("/api/v1", budgetRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", expenseRouter);
app.use("/api/v1", incomeRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", transactionReportRouter);
app.use("/api/v1", transactionRouter);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global Error Handler
app.use(globalErrorHandler);

export default app;
