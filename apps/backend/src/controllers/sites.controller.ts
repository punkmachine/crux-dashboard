import { Request, Response } from "express";
import { Repository } from "typeorm";
import { Site } from "../entities/Site.js";
import { AppDataSource } from "../config/database.js";

export class SitesController {
  private siteRepository: Repository<Site>;

  constructor() {
    this.siteRepository = AppDataSource.getRepository(Site);
  }

  async getAllSites(_req: Request, res: Response): Promise<void> {
    try {
      const sites = await this.siteRepository.find({
        order: { createdAt: "DESC" },
      });
      res.json(sites);
    } catch (error) {
      console.error("Ошибка при получении списка сайтов:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  }

  async createSite(req: Request, res: Response): Promise<void> {
    try {
      const { url, name, isActive } = req.body;

      if (!url || !name) {
        res.status(400).json({ error: "Поля url и name обязательны" });
        return;
      }

      // Валидация origin
      try {
        new URL(url);
      } catch {
        res.status(400).json({ error: "Некорректный формат URL" });
        return;
      }

      const site = this.siteRepository.create({
        url,
        name,
        isActive: isActive !== undefined ? isActive : true,
      });

      const savedSite = await this.siteRepository.save(site);
      res.status(201).json(savedSite);
    } catch (error) {
      console.error("Ошибка при создании сайта:", error);
      if (
        error instanceof Error &&
        error.message.includes("duplicate key value")
      ) {
        res.status(409).json({ error: "Сайт с таким URL уже существует" });
        return;
      }
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  }

  async updateSite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;

      const site = await this.siteRepository.findOne({ where: { id } });

      if (!site) {
        res.status(404).json({ error: "Сайт не найден" });
        return;
      }

      if (name !== undefined) {
        site.name = name;
      }

      if (isActive !== undefined) {
        site.isActive = isActive;
      }

      const updatedSite = await this.siteRepository.save(site);
      res.json(updatedSite);
    } catch (error) {
      console.error("Ошибка при обновлении сайта:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  }
}
