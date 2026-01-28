import express, { type Express, type Request, type Response } from "express";
import sitesRoutes from "../routes/sites.routes.js";
import metricsRoutes from "../routes/metrics.routes.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/sites", sitesRoutes);
  app.use("/api/metrics", metricsRoutes);

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error("Ошибка:", err);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    },
  );

  return app;
}
