import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DatabaseConnection } from "./db/db";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerConfig";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

dotenv.config();

if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  console.error("Missing required Clerk environment variables");
  process.exit(1);
}

const app = express();
const { readdirSync } = require("fs");
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const PORT = process.env.PORT;

// middlewares
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

const server = async () => {
  try {
    await DatabaseConnection.connect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Environment:", {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        clientUrl: process.env.CLIENT_URL,
        clerkKeysPresent: {
          secret: !!process.env.CLERK_SECRET_KEY,
          publishable: !!process.env.CLERK_PUBLISHABLE_KEY,
        },
      });
    });
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
};

server();
