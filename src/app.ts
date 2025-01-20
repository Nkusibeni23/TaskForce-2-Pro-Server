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

// Mount routes explicitly
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
