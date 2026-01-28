import type { MetricName } from "../../types/crux.js";
import { createMetricRow } from "../metric-row.js";

const PERFORMANCE_METRICS: MetricName[] = [
  "first_contentful_paint",
  "experimental_time_to_first_byte",
  "round_trip_time",
];

/**
 * Создает строки метрик для метрик производительности (FCP, TTFB, RTT).
 *
 * @param siteId - ID сайта
 * @returns Массив DOM-элементов строк метрик
 */
export async function createPerformanceMetrics(
  siteId: string,
): Promise<HTMLElement[]> {
  const rows: HTMLElement[] = [];

  for (const metricName of PERFORMANCE_METRICS) {
    const row = await createMetricRow(siteId, metricName);
    rows.push(row);
  }

  return rows;
}
