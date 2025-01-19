import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../../../src/app";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Force Pro API Documentation",
      version: "1.0.0",
      description: "API documentation for Task Force Pro",
    },
    servers: [
      {
        url: "/.netlify/functions/express-server",
        description: "Netlify Serverless Function",
      },
    ],
  },
  apis: [path.join(__dirname, "../../../src/routers/*.ts")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export const handler = serverless(app);
