import type { MetricName } from "../../types/crux.js";
import { createMetricRow } from "../metric-row.js";

const LCP_DETAIL_METRICS: MetricName[] = [
  "largest_contentful_paint_image_time_to_first_byte",
  "largest_contentful_paint_image_resource_load_delay",
  "largest_contentful_paint_image_resource_load_duration",
  "largest_contentful_paint_image_element_render_delay",
];

/**
 * Создает строки метрик для детальных метрик LCP.
 *
 * @param siteId - ID сайта
 * @returns Массив DOM-элементов строк метрик
 */
export async function createLcpDetailMetrics(
  siteId: string,
): Promise<HTMLElement[]> {
  const rows: HTMLElement[] = [];

  for (const metricName of LCP_DETAIL_METRICS) {
    const row = await createMetricRow(siteId, metricName);
    rows.push(row);
  }

  return rows;
}
