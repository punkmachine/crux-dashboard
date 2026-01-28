import type { CruxResponse } from "../../types/crux";
import type { Metric } from "../../types/crux";
import { METRIC_NAME } from "./constants";
import { extractFractions } from "./utils/extract-fractions";
import { createLcpResourceTypeCard } from "./utils/create-lcp-resource-type-card";

/**
 * Рендерит блок с метрикой типов ресурсов LCP.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderLcpResourceType(data: CruxResponse): HTMLElement | null {
  if (data.error || !data.record) {
    return null;
  }

  const metrics = data.record.metrics;
  if (!metrics) {
    return null;
  }

  const metricValue = metrics[METRIC_NAME];
  if (!metricValue) {
    return null;
  }

  const fractions = extractFractions(metricValue);
  if (!fractions) {
    return null;
  }

  return createLcpResourceTypeCard(fractions);
}
