import type { Bin } from "../../../types/crux";

/**
 * Извлекает данные гистограммы из метрики.
 *
 * @param metricValue - Значение метрики из CrUX API
 * @returns Массив бинов гистограммы или null, если недоступно
 */
export function extractHistogram(metricValue: any): Bin[] | null {
  if (!metricValue || !metricValue.histogram) {
    return null;
  }

  return Array.isArray(metricValue.histogram) ? metricValue.histogram : null;
}
