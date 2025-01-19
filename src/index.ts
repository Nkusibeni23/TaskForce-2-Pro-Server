import dotenv from "dotenv";
import { DatabaseConnection } from "./db/db";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

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
