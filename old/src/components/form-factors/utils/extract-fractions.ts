import type { MetricValue } from "../../../types/crux";
import type { Fractions } from "../../../types/crux";

/**
 * Извлекает данные fractions из метрики.
 *
 * @param metricValue - Значение метрики из CrUX API
 * @returns Объект с fractions или null, если данные недоступны
 */
export function extractFractions(metricValue: MetricValue): Fractions | null {
  if ("fractions" in metricValue && metricValue.fractions) {
    return metricValue.fractions;
  }

  return null;
}
