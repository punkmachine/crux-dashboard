import { Router } from "express";
import { MetricsController } from "../controllers/metrics.controller.js";

const router: Router = Router();
const metricsController = new MetricsController();

router.get("/:siteId", (req, res) => metricsController.getMetrics(req, res));

export default router;
