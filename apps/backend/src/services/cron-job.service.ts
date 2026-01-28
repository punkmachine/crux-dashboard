import { CronJob } from "cron";
import { Repository } from "typeorm";
import { Site } from "../entities/Site.js";
import { Metric } from "../entities/Metric.js";
import { CruxApiService } from "./crux-api.service.js";
import { retryWithBackoff } from "../utils/retry.js";
import { AppDataSource } from "../config/database.js";

export class CronJobService {
  private cruxApiService: CruxApiService;
  private siteRepository: Repository<Site>;
  private metricRepository: Repository<Metric>;
  private cronJob: CronJob | null = null;

  constructor() {
    this.cruxApiService = new CruxApiService();
    this.siteRepository = AppDataSource.getRepository(Site);
    this.metricRepository = AppDataSource.getRepository(Metric);
  }

  start(): void {
    const schedule = process.env.CRON_SCHEDULE || "0 0 * * *"; // По умолчанию каждый день в полночь

    this.cronJob = new CronJob(
      schedule,
      async () => {
        console.log(`[Cron Job] Запуск парсинга данных CrUX API...`);
        await this.fetchAndSaveMetrics();
      },
      null,
      true,
      "Europe/Moscow",
    );

    console.log(`[Cron Job] Запущен с расписанием: ${schedule}`);
  }

  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log("[Cron Job] Остановлен");
    }
  }

  private async fetchAndSaveMetrics(): Promise<void> {
    try {
      const activeSites = await this.siteRepository.find({
        where: { isActive: true },
      });

      if (activeSites.length === 0) {
        console.log("[Cron Job] Нет активных сайтов для парсинга");
        return;
      }

      console.log(
        `[Cron Job] Найдено ${activeSites.length} активных сайтов для парсинга`,
      );

      for (const site of activeSites) {
        try {
          await this.processSite(site);
        } catch (error) {
          console.error(
            `[Cron Job] Ошибка при обработке сайта ${site.url}:`,
            error,
          );
        }
      }

      console.log("[Cron Job] Парсинг данных завершен");
    } catch (error) {
      console.error("[Cron Job] Критическая ошибка при парсинге:", error);
    }
  }

  private async processSite(site: Site): Promise<void> {
    console.log(`[Cron Job] Обработка сайта: ${site.url}`);

    const cruxData = await retryWithBackoff(() =>
      this.cruxApiService.fetchCruxData(site.url),
    );

    if (cruxData.error) {
      throw new Error(`CrUX API вернул ошибку: ${cruxData.error.message}`);
    }

    if (!cruxData.record) {
      console.warn(`[Cron Job] Нет данных для сайта ${site.url}`);
      return;
    }

    const collectionPeriod = cruxData.record.collectionPeriod;
    if (!collectionPeriod) {
      console.warn(`[Cron Job] Нет периода сбора данных для сайта ${site.url}`);
      return;
    }

    const collectionPeriodStart = new Date(
      collectionPeriod.firstDate.year,
      collectionPeriod.firstDate.month - 1,
      collectionPeriod.firstDate.day,
    );
    const collectionPeriodEnd = new Date(
      collectionPeriod.lastDate.year,
      collectionPeriod.lastDate.month - 1,
      collectionPeriod.lastDate.day,
    );

    const metric = this.metricRepository.create({
      siteId: site.id,
      createCollectionDate: new Date(),
      collectionPeriodStart,
      collectionPeriodEnd,
      cruxData: cruxData as Record<string, unknown>,
    });

    await this.metricRepository.save(metric);

    console.log(`[Cron Job] Данные для сайта ${site.url} успешно сохранены`);
  }
}
