import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { isProduction } from "./config";
import redis from "./connectors/redis";
import routes from "./routes";

const app = express();

if (!isProduction) {
  app.use(cors());
}

// Body parser middleware
app.use((req, res, next) => {
  if (req.path === "/api/transactions") {
    next(); // Skip body-parser.json() for /api/transactions
  } else {
    bodyParser.json()(req, res, next); // Apply body-parser.json() for all other routes
  }
});

// API routes
app.use("/api", routes);

if (isProduction) {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Handles any requests that don't match the API ones above
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

const port = 5000;

async function startServer() {
  try {
    await redis.connectRedis();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();

export default app;
