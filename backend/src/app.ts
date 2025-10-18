import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";

// Import routes

import routes from "./routes";
import { logger } from "./utils/logger";

const app = express();

// Middleware
app.use(helmet());

// app.use((req, res, next) => {
//   // Block requests from localhost:8080
//   if (
//     req.headers.host === "localhost:8080" ||
//     req.headers.origin?.includes("localhost:8080")
//   ) {
//     return res.status(403).json({ error: "Access denied from localhost:8080" });
//   }

//   // Add security headers
//   res.setHeader("X-Content-Type-Options", "nosniff");
//   res.setHeader("X-Frame-Options", "DENY");
//   res.setHeader("X-XSS-Protection", "1; mode=block");
//   res.setHeader(
//     "Strict-Transport-Security",
//     "max-age=31536000; includeSubDomains"
//   );

//   next();
// });

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes",
  },
});

// General rate limit for other endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
});

// Apply different limits to different routes
// app.use('/api/auth', authLimiter);
// app.use('/api', generalLimiter);

// CORS configuration - Only allow specific origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://www.himsols.com",
        "https://eco-roots-bloom-himsols.vercel.app",
        "http://localhost:8888",
        "http://localhost:8000",
        process.env.FRONTEND_URL, // Environment variable
      ];

      // Check if origin is allowed
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked request from unauthorized origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/authentication
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Use production logging format and pipe to our logger for live logs
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        // This will appear in live logs
        console.log(message.trim());
        // Also log to our logger
        logger.info("HTTP Request", { message: message.trim() });
      },
    },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes

app.use("/api", routes);

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

export default app;
