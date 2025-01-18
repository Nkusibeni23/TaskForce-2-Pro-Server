import { Options } from "swagger-jsdoc";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskForce API Documentation",
      version: "1.0.0",
      description: "API documentation for the TaskForce API",
    },
    servers: [
      {
        url: `${process.env.SERVER_URL ?? "http://localhost"}:${
          process.env.PORT ?? 3001
        }/api/v1`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routers/*.ts"],
};
