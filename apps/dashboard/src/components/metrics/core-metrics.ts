import type { MetricName } from "../../types/crux.js";
import { createMetricRow } from "../metric-row.js";

const CORE_METRICS: MetricName[] = [
  "largest_contentful_paint",
  "interaction_to_next_paint",
  "cumulative_layout_shift",
];

/**
 * Создает строки метрик для основных метрик (LCP, INP, CLS).
 *
 * @param siteId - ID сайта
 * @returns Массив DOM-элементов строк метрик
 */
export async function createCoreMetrics(
  siteId: string,
): Promise<HTMLElement[]> {
  const rows: HTMLElement[] = [];

  for (const metricName of CORE_METRICS) {
    const row = await createMetricRow(siteId, metricName);
    rows.push(row);
  }

  return rows;
}
