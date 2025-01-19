import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerConfig";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app = express();
const { readdirSync } = require("fs");
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Load routes
readdirSync(path.join(__dirname, "routers")).forEach((file: string) => {
  if (file.endsWith(".ts")) {
    try {
      const router = require(`./routers/${file}`).default;
      app.use("/api/v1", router);
    } catch (error) {
      console.error(`Error loading route file ${file}:`, error);
    }
  }
});

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global Error Handler
app.use(globalErrorHandler);

export default app;
