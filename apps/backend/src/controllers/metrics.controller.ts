import { Request, Response } from "express";
import { Repository, MoreThanOrEqual } from "typeorm";
import { Metric } from "../entities/Metric.js";
import { AppDataSource } from "../config/database.js";
import { FormFactorResponse } from "../types/crux.js";

type Period = "1m" | "3m" | "6m" | "1y";
type GroupBy = "day" | "week" | "month";
type FormFactorFilter = "PHONE" | "TABLET" | "DESKTOP" | "ALL";

export class MetricsController {
  private metricRepository: Repository<Metric>;

  constructor() {
    this.metricRepository = AppDataSource.getRepository(Metric);
  }

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { siteId } = req.params;
      const metric = req.query.metric as string | undefined;
      const formFactor = (req.query.formFactor as FormFactorFilter) || "ALL";
      const period = (req.query.period as Period) || "1m";
      const groupBy = (req.query.groupBy as GroupBy) || "day";

      // Фильтрация на уровне БД: siteId и period
      const periodStart = this.getPeriodStartDate(period);
      const where: Record<string, unknown> = {
        siteId,
        collectionPeriodStart: MoreThanOrEqual(periodStart),
      };

      let metrics = await this.metricRepository.find({
        where,
        order: { collectionPeriodStart: "ASC" },
      });

      // Фильтрация в приложении: metric, formFactor
      if (metric) {
        metrics = metrics.filter((m) => {
          const cruxData = m.cruxData as {
            record?: { metrics?: Record<string, unknown> };
          };
          return cruxData.record?.metrics?.[metric] !== undefined;
        });
      }

      if (formFactor !== "ALL") {
        const formFactorLower = formFactor.toLowerCase() as FormFactorResponse;
        metrics = metrics.filter((m) => {
          const cruxData = m.cruxData as {
            record?: { key?: { formFactor?: FormFactorResponse } };
          };
          const recordFormFactor = cruxData.record?.key?.formFactor;
          // Если formFactor не указан в данных, это агрегированные данные - показываем только при ALL
          // Если указан, сравниваем с запрошенным
          return recordFormFactor === formFactorLower;
        });
      }

      // Группировка в приложении: groupBy
      if (groupBy !== "day") {
        metrics = this.groupMetrics(metrics, groupBy);
      }

      res.json(metrics);
    } catch (error) {
      console.error("Ошибка при получении метрик:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  }

  private getPeriodStartDate(period: Period): Date {
    const now = new Date();
    const start = new Date(now);

    switch (period) {
      case "1m":
        start.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        start.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        start.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return start;
  }

  private groupMetrics(metrics: Metric[], groupBy: GroupBy): Metric[] {
    const grouped = new Map<string, Metric[]>();

    for (const metric of metrics) {
      const key = this.getGroupKey(metric.collectionPeriodStart, groupBy);
      const existing = grouped.get(key) || [];
      existing.push(metric);
      grouped.set(key, existing);
    }

    // Возвращаем первый элемент из каждой группы
    return Array.from(grouped.values()).map((group) => group[0]);
  }

  private getGroupKey(date: Date, groupBy: GroupBy): string {
    const d = new Date(date);

    switch (groupBy) {
      case "week": {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return `${weekStart.getFullYear()}-W${this.getWeekNumber(weekStart)}`;
      }
      case "month":
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      default:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
