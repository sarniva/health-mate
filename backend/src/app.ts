import express from "express";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/errorMiddleware";
import { sendSuccessResponse } from "./utils/errorHandler";

// Route imports
import authRoutes from "./routes/authRoutes";
import healthProfileRoutes from "./routes/healthProfileRoutes";
import workSessionRoutes from "./routes/workSessionRoutes";
import activityRoutes from "./routes/activityRoutes";
import gamificationRoutes from "./routes/gamificationRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import peerChallengeRoutes from "./routes/peerChallengeRoutes";
import reminderRoutes from "./routes/reminderRoutes";

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  if (corsOptions.origin === origin || corsOptions.origin === "*") {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health check endpoint (before auth middleware)
 */
app.get("/health", (req, res) => {
  sendSuccessResponse(res, 200, { status: "ok" }, "Server is up and running");
});

/**
 * Root endpoint
 */
app.get("/", (req, res) => {
  sendSuccessResponse(res, 200, { message: "Wellness Nudge API" });
});

/**
 * API v1 Routes
 */
const apiV1 = express.Router();

// Auth routes (public - no JWT needed for signup/login)
apiV1.use("/auth", authRoutes);

// Protected routes (require JWT token)
apiV1.use("/health-profile", healthProfileRoutes);
apiV1.use("/work-sessions", workSessionRoutes);
apiV1.use("/activities", activityRoutes);
apiV1.use("/gamification", gamificationRoutes);
apiV1.use("/leaderboards", leaderboardRoutes);
apiV1.use("/peer-challenges", peerChallengeRoutes);
apiV1.use("/reminders", reminderRoutes);

app.use("/api/v1", apiV1);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 Not Found middleware
app.use(notFoundMiddleware);

// Global error handler middleware (must be last)
app.use(errorMiddleware);

export default app;

