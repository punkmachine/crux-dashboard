import { Router } from "express";
import { SitesController } from "../controllers/sites.controller.js";

const router: Router = Router();
const sitesController = new SitesController();

router.get("/", (req, res) => sitesController.getAllSites(req, res));
router.post("/", (req, res) => sitesController.createSite(req, res));
router.patch("/:id", (req, res) => sitesController.updateSite(req, res));

export default router;
