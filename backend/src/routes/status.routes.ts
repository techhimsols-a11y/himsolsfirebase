import { Router } from "express";
import { prisma } from "../lib/prisma";
import { logger } from "../utils/logger";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get basic system info
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    // Get database stats
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    const treeCount = await prisma.tree.count();

    logger.info("Health check performed", {
      uptime,
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + "MB",
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + "MB",
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + "MB",
      },
      database: {
        status: "connected",
        userCount,
        orderCount,
        treeCount,
      },
    });

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      database: {
        status: "connected",
        userCount,
        orderCount,
        treeCount,
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + "MB",
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + "MB",
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + "MB",
      },
    });
  } catch (error) {
    logger.error("Health check failed", { error: (error as Error).message });
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
    });
  }
});

export default router;
