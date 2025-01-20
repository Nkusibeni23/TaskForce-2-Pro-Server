import dotenv from "dotenv";
import { DatabaseConnection } from "./db/db";
import app from "./app";

// Define interface for router layer
interface RouterLayer {
  route?: {
    path: string;
    methods: { [key: string]: boolean };
  };
}

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await DatabaseConnection.connect();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Environment:", {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        clientUrl: process.env.CLIENT_URL,
        // Log registered routes with proper typing
        routes: (app._router.stack as RouterLayer[])
          .filter((r: RouterLayer) => r.route)
          .map((r: RouterLayer) => ({
            path: r.route!.path,
            methods: Object.keys(r.route!.methods),
          })),
        clerkKeysPresent: {
          secret: !!process.env.CLERK_SECRET_KEY,
          publishable: !!process.env.CLERK_PUBLISHABLE_KEY,
        },
      });
    });

    // Handle server shutdown
    process.on("SIGTERM", () => {
      console.log("Received SIGTERM. Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
};

startServer();
