import { Router } from "express";
import authRoutes from "./auth.routes";
import treeRoutes from "./tree.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./order.routes";
import serviceRoutes from "./service.routes";
import serviceRequestRoutes from "./serviceRequest.routes";
import statusRoutes from "./status.routes";
import adminRoutes from "./admin.routes";
import metricsRoutes from "./metrics.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/trees", treeRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/services", serviceRoutes);
router.use("/requests", serviceRequestRoutes);
router.use("/status", statusRoutes);
router.use("/admin", adminRoutes);
router.use("/metrics", metricsRoutes);

export default router;
