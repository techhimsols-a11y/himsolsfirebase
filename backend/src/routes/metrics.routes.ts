import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Get database metrics
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    const treeCount = await prisma.tree.count();
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });

    // Get system metrics
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const metrics = `# HELP eco_roots_users_total Total number of users
# TYPE eco_roots_users_total gauge
eco_roots_users_total ${userCount}

# HELP eco_roots_orders_total Total number of orders
# TYPE eco_roots_orders_total gauge
eco_roots_orders_total ${orderCount}

# HELP eco_roots_trees_total Total number of trees
# TYPE eco_roots_trees_total gauge
eco_roots_trees_total ${treeCount}

# HELP eco_roots_admins_total Total number of admin users
# TYPE eco_roots_admins_total gauge
eco_roots_admins_total ${adminCount}

# HELP eco_roots_uptime_seconds Application uptime in seconds
# TYPE eco_roots_uptime_seconds gauge
eco_roots_uptime_seconds ${uptime}

# HELP eco_roots_memory_rss_bytes Resident set size in bytes
# TYPE eco_roots_memory_rss_bytes gauge
eco_roots_memory_rss_bytes ${memoryUsage.rss}

# HELP eco_roots_memory_heap_used_bytes Heap memory used in bytes
# TYPE eco_roots_memory_heap_used_bytes gauge
eco_roots_memory_heap_used_bytes ${memoryUsage.heapUsed}

# HELP eco_roots_memory_heap_total_bytes Total heap memory in bytes
# TYPE eco_roots_memory_heap_total_bytes gauge
eco_roots_memory_heap_total_bytes ${memoryUsage.heapTotal}
`;

    res.set("Content-Type", "text/plain");
    res.send(metrics);
  } catch (error) {
    res.status(500).send(`# ERROR: ${(error as Error).message}`);
  }
});

export default router;
