import type { Bin } from "../../../types/crux";
import type { PerformanceMetricName } from "../types";
import { THRESHOLDS } from "../../../utils/thresholds/constants";

/**
 * Группирует бины гистограммы по зонам (good, needs-improvement, poor).
 *
 * @param bins - Массив бинов гистограммы
 * @param metricName - Название метрики
 * @returns Объект с процентами пользователей в каждой зоне
 */
export function groupBinsByZones(
  bins: Bin[],
  metricName: PerformanceMetricName,
): {
  good: number;
  needsImprovement: number;
  poor: number;
} {
  const threshold = THRESHOLDS[metricName];
  if (!threshold) {
    return { good: 0, needsImprovement: 0, poor: 0 };
  }

  let good = 0;
  let needsImprovement = 0;
  let poor = 0;

  for (const bin of bins) {
    const start =
      typeof bin.start === "string" ? parseFloat(bin.start) : bin.start;
    const end = bin.end
      ? typeof bin.end === "string"
        ? parseFloat(bin.end)
        : bin.end
      : Number.MAX_SAFE_INTEGER;

    // Используем конец бина для классификации (более консервативный подход)
    // Если конец бина не определен, используем начало
    const binEnd = end === Number.MAX_SAFE_INTEGER ? start : end;

    if (binEnd <= threshold.good) {
      good += bin.density;
    } else if (binEnd <= threshold.poor) {
      needsImprovement += bin.density;
    } else {
      poor += bin.density;
    }
  }

  return {
    good: good * 100,
    needsImprovement: needsImprovement * 100,
    poor: poor * 100,
  };
}
