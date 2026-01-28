import { THRESHOLDS } from "./constants";
import type { MetricStatus } from "./types";

/**
 * Определяет статус метрики на основе её значения и пороговых значений.
 *
 * @param metricName - Название метрики
 * @param value - Значение метрики
 * @returns Статус метрики: "good", "needs-improvement" или "poor". Возвращает "good" если пороги не найдены
 */
export function getMetricStatus(
  metricName: string,
  value: number,
): MetricStatus {
  const threshold = THRESHOLDS[metricName];

  if (!threshold) {
    return "good";
  }

  if (value <= threshold.good) {
    return "good";
  }

  if (value <= threshold.poor) {
    return "needs-improvement";
  }

  return "poor";
}
