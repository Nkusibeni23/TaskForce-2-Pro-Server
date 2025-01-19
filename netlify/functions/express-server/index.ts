import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../../../src/app";

dotenv.config();

// Export the serverless handler for Netlify
export const handler = serverless(app);
