import type { MetricName } from "../../types/crux.js";
import { createMetricRow } from "../metric-row.js";

const DISTRIBUTION_METRICS: MetricName[] = [
  "form_factors",
  "navigation_types",
  "largest_contentful_paint_resource_type",
];

/**
 * Создает строки метрик для распределительных метрик (Form Factors, Navigation Types, LCP Resource Type).
 *
 * @param siteId - ID сайта
 * @returns Массив DOM-элементов строк метрик
 */
export async function createDistributionMetrics(
  siteId: string,
): Promise<HTMLElement[]> {
  const rows: HTMLElement[] = [];

  for (const metricName of DISTRIBUTION_METRICS) {
    const row = await createMetricRow(siteId, metricName);
    rows.push(row);
  }

  return rows;
}
